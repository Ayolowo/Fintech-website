'use client';

import {
  TransactionMessage,
  PublicKey,
  VersionedTransaction,
  Connection,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TokenAccountNotFoundError,
} from '@solana/spl-token';
import { Buffer } from 'buffer';

// USDC on Solana mainnet
const USDC_MINT_MAINNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const API_URL = '/api';

/**
 * Transfer USDC on Solana using sponsored transactions
 * This function prepares and signs a sponsored transaction (following Privy pattern)
 *
 * @param recipientAddress - Solana address to receive USDC
 * @param amount - Amount of USDC to transfer (as string, e.g., "100.50")
 * @param senderWallet - Privy embedded wallet object
 * @param getAccessToken - Function to get Privy access token
 * @param signTransactionFn - Optional Privy signTransaction function (for web)
 * @returns Transaction signature and details
 */
export const transferUSDC = async (
  recipientAddress: string,
  amount: string,
  senderWallet: any,
  getAccessToken: () => Promise<string>,
  signTransactionFn?: (params: { transaction: Uint8Array; wallet: any }) => Promise<{ signedTransaction: Uint8Array }>
): Promise<{
  signature: string;
  amount: string;
  recipient: string;
}> => {
  try {
    if (!senderWallet) {
      throw new Error('Sender wallet is required');
    }

    // Prepare headers with authentication
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('Authentication required');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    // Get fee payer public key from backend
    const feePayerResponse = await fetch(`${API_URL}/public-key`, { headers });
    if (!feePayerResponse.ok) {
      throw new Error('Failed to get fee payer public key');
    }
    const { publicKey: feePayerAddress } = await feePayerResponse.json();

    // Create connection using Alchemy RPC endpoint
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_BASE_URL;
    if (!rpcUrl) {
      throw new Error('RPC URL not configured');
    }
    const connection = new Connection(rpcUrl, 'confirmed');

    // Convert amount to lamports (USDC has 6 decimals)
    const amountLamports = Math.floor(parseFloat(amount) * 1e6);

    // Create public keys
    const sender = new PublicKey(senderWallet.address);
    const recipient = new PublicKey(recipientAddress);
    const usdcMint = new PublicKey(USDC_MINT_MAINNET);
    const feePayer = new PublicKey(feePayerAddress);

    // Get associated token addresses
    const senderATA = await getAssociatedTokenAddress(usdcMint, sender);
    const recipientATA = await getAssociatedTokenAddress(usdcMint, recipient);

    // Check if sender has USDC account
    let senderTokenAccount;
    try {
      senderTokenAccount = await getAccount(connection, senderATA);
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        throw new Error('You do not have a USDC account. Please receive USDC first to create your account.');
      }
      throw new Error(`Error checking USDC account: ${(error as Error).message}`);
    }

    // Check if sender has enough balance
    const senderBalance = Number(senderTokenAccount.amount);

    if (senderBalance < amountLamports) {
      throw new Error(`Insufficient USDC balance. You have $${(senderBalance / 1e6).toFixed(4)} USDC, but need $${amount}`);
    }

    // Check if recipient has USDC account
    let needsRecipientATA = false;
    try {
      await getAccount(connection, recipientATA);
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        needsRecipientATA = true;
      } else {
        throw error;
      }
    }

    // Create instructions
    const instructions = [];

    // Create recipient ATA if needed
    if (needsRecipientATA) {
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        feePayer, // Fee payer pays for account creation
        recipientATA, // New account
        recipient, // Owner
        usdcMint // Mint
      );
      instructions.push(createATAInstruction);
    }

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      senderATA, // Source
      recipientATA, // Destination
      sender, // Owner (user must sign this)
      amountLamports // Amount
    );
    instructions.push(transferInstruction);

    // Create a function to build and sign transaction with fresh blockhash
    const createSignedTransaction = async (): Promise<VersionedTransaction> => {
      // Get fresh blockhash right before creating transaction
      const { blockhash } = await connection.getLatestBlockhash('finalized');

      // Create the transaction message with fee payer set to the backend wallet
      const message = new TransactionMessage({
        payerKey: feePayer,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      // Create transaction
      const transaction = new VersionedTransaction(message);

      // For Privy web wallets, use the signTransaction hook
      if (signTransactionFn) {
        const txBytes = transaction.serialize();
        const { signedTransaction } = await signTransactionFn({
          transaction: txBytes,
          wallet: senderWallet,
        });
        return VersionedTransaction.deserialize(signedTransaction);
      } else if (typeof senderWallet.getProvider === 'function') {
        // Fallback for RN/Expo Privy wallets
        const provider = await senderWallet.getProvider();

        // Serialize message for signing
        const serializedMessage = Buffer.from(transaction.message.serialize()).toString('base64');

        // Get user signature
        const { signature: serializedUserSignature } = await provider.request({
          method: 'signMessage',
          params: {
            message: serializedMessage,
          },
        });

        // Add user signature to transaction
        const userSignature = Buffer.from(serializedUserSignature, 'base64');
        transaction.addSignature(new PublicKey(senderWallet.address), userSignature);

        return transaction;
      } else {
        throw new Error('Wallet does not support transaction signing');
      }
    };

    // Function to attempt transaction with retry on stale blockhash
    const attemptTransaction = async (maxRetries = 3): Promise<any> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        // Create fresh transaction for each attempt
        let transaction: VersionedTransaction;
        try {
          transaction = await createSignedTransaction();
        } catch (signError) {
          if (attempt === maxRetries) {
            throw signError;
          }
          continue;
        }

        // Serialize transaction for backend
        const serializedTransaction = Buffer.from(transaction.serialize()).toString('base64');

        const response = await fetch(`${API_URL}/sponsor-transaction`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ transaction: serializedTransaction }),
        });

        if (response.ok) {
          const responseData = await response.json();
          return responseData;
        }

        // Handle error response
        const errorText = await response.text();

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (_parseError) {
          throw new Error(`Backend error: ${response.status} - ${errorText}`);
        }

        // Check if this is a stale blockhash error and retry if we have attempts left
        if (errorData.error === 'STALE_BLOCKHASH' && attempt < maxRetries) {
          continue; // Will create a new fresh transaction in next loop iteration
        }

        // If not a stale blockhash error, or max retries reached, throw the error
        throw new Error(errorData.error || errorData.details || 'Transaction failed');
      }

      throw new Error('Maximum retry attempts reached');
    };

    // Attempt the transaction with retry logic
    const responseData = await attemptTransaction();

    return {
      signature: responseData.signature,
      amount: amount,
      recipient: recipientAddress,
    };
  } catch (error) {
    console.error('❌ Transfer error:', error);
    throw error;
  }
};
