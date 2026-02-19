'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { transferUSDC } from '@/lib/solana/transferUSDC';

type Step = 'select_account' | 'recipient' | 'amount' | 'review' | 'processing' | 'success';

interface BankAccountDetails {
  fullName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  bankName: string;
}

interface AddressDetails {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface BridgeExternalAccount {
  id: string;
  customer_id: string;
  currency: string;
  account_owner_name: string;
  bank_name?: string;
  account?: {
    account_number: string;
    routing_number: string;
  };
  address?: AddressDetails;
}

interface SendMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
  onSuccess?: () => void;
}

const ACH_FEE = 15; // $15 fee for business ACH transfers

export function SendMoneyModal({
  open,
  onOpenChange,
  walletBalance,
  onSuccess,
}: SendMoneyModalProps) {
  const router = useRouter();
  const { user } = usePrivy();
  const { getAuthToken } = useAuth();

  const [step, setStep] = useState<Step>('select_account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Account selection
  const [externalAccounts, setExternalAccounts] = useState<BridgeExternalAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<BridgeExternalAccount | null>(null);

  // New account details
  const [bankDetails, setBankDetails] = useState<BankAccountDetails>({
    fullName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    bankName: '',
  });
  const [address, setAddress] = useState<AddressDetails>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  // Amount
  const [amount, setAmount] = useState('');

  const userEmail = user?.email?.address || '';
  const solanaWallet = user?.linkedAccounts?.find(
    (account: any) =>
      account.type === 'wallet' &&
      account.chainType === 'solana' &&
      account.walletClientType === 'privy'
  ) as any;

  // Load external accounts
  useEffect(() => {
    if (!open || step !== 'select_account') return;

    const loadAccounts = async () => {
      if (!userEmail) return;

      try {
        setLoadingAccounts(true);
        const token = await getAuthToken();
        const response = await fetch(
          `/api/bridge/external-accounts/list?email=${userEmail}&currency=usd`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setExternalAccounts(data.data || []);
        }
      } catch (error) {
        console.error('Failed to load accounts:', error);
        setExternalAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    };

    loadAccounts();
  }, [open, step, userEmail, getAuthToken]);

  const handleBack = () => {
    if (step === 'select_account') {
      onOpenChange(false);
    } else if (step === 'recipient') {
      setStep('select_account');
    } else if (step === 'amount') {
      if (selectedAccount) {
        setStep('select_account');
      } else {
        setStep('recipient');
      }
    } else if (step === 'review') {
      setStep('amount');
    }
  };

  const handleAmountSubmit = () => {
    const fiatAmount = parseFloat(amount);

    if (!amount || fiatAmount <= 0) {
      setError('Please enter an amount');
      return;
    }

    if (fiatAmount < 1) {
      setError('Minimum amount is $1.00');
      return;
    }

    const totalCost = fiatAmount + ACH_FEE;
    if (totalCost > walletBalance) {
      setError('Insufficient balance to cover amount and fee');
      return;
    }

    setError('');
    setStep('review');
  };

  const handleSubmit = async () => {
    if (!solanaWallet) {
      setError('Missing wallet information');
      return;
    }

    setLoading(true);
    setStep('processing');
    setError('');

    try {
      let externalAccountId: string;

      // Create new account if needed
      if (!selectedAccount) {
        const token = await getAuthToken();
        const response = await fetch(
          `/api/bridge/external-accounts/create`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userEmail,
              currency: 'usd',
              bank_name: bankDetails.bankName,
              account_owner_name: bankDetails.fullName,
              account_type: 'us',
              account: {
                account_number: bankDetails.accountNumber,
                routing_number: bankDetails.routingNumber,
                checking_or_savings: bankDetails.accountType,
              },
              address: {
                street_line_1: address.street,
                city: address.city,
                state: address.state,
                postal_code: address.postalCode,
                country: address.country,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create bank account');
        }

        const accountData = await response.json();
        externalAccountId = accountData.id;
      } else {
        externalAccountId = selectedAccount.id;
      }

      // Create withdrawal
      const fiatAmount = parseFloat(amount);
      const totalCost = fiatAmount + ACH_FEE;

      const token = await getAuthToken();
      const withdrawalResponse = await fetch(
        `/api/bridge/withdrawal/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            wallet_address: solanaWallet.address,
            amount_usdc: totalCost.toFixed(2),
            currency: 'usd',
            external_account_id: externalAccountId,
            developer_fee: ACH_FEE.toFixed(2),
            payment_rail: 'ach_same_day',
          }),
        }
      );

      if (!withdrawalResponse.ok) {
        const errorData = await withdrawalResponse.json();
        throw new Error(errorData.error || 'Failed to create transfer');
      }

      const transfer = await withdrawalResponse.json();

      // Step 3: Send USDC on-chain to Bridge deposit address
      const txSignature = await transferUSDC(
        transfer.deposit_address,
        transfer.deposit_amount.toString(),
        solanaWallet,
        getAuthToken
      );

      // Step 4: Save transaction to business_transactions table
      const recipientName = selectedAccount?.account_owner_name || bankDetails.fullName;

      await fetch(
        `/api/business/transactions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: solanaWallet.address,
            recipient_name: recipientName,
            recipient_bank_name: selectedAccount?.bank_name || bankDetails.bankName,
            recipient_account_number: selectedAccount?.account?.account_number || bankDetails.accountNumber,
            recipient_routing_number: selectedAccount?.account?.routing_number || bankDetails.routingNumber,
            recipient_address_street: address.street || '',
            recipient_address_city: address.city || '',
            recipient_address_state: address.state || '',
            recipient_address_postal_code: address.postalCode || '',
            recipient_address_country: address.country || 'US',
            amount_usdc: totalCost,
            amount_fiat: fiatAmount,
            fiat_currency: 'USD',
            exchange_rate: 1.0,
            payment_method: 'ach',
            bridge_transaction_id: transfer.transfer_id,
            bridge_deposit_address: transfer.deposit_address,
            bridge_deposit_amount: transfer.deposit_amount,
            transaction_hash: txSignature.signature,
            status: 'pending',
          }),
        }
      );

      setStep('success');
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || 'Transfer failed. Please try again.');
      setStep('review');
    } finally {
      setLoading(false);
    }
  };

  const renderSelectAccount = () => (
    <div className="space-y-4">
      {loadingAccounts ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <>
          {externalAccounts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Saved Accounts</p>
              {externalAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    setSelectedAccount(account);
                    setStep('amount');
                  }}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between text-left"
                >
                  <div>
                    <p className="font-medium text-gray-900">{account.account_owner_name}</p>
                    <p className="text-sm text-gray-600">
                      {account.bank_name} ••••{account.account?.account_number.slice(-4)}
                    </p>
                  </div>
                  <div className="text-gray-400">→</div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setSelectedAccount(null);
              setStep('recipient');
            }}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center justify-center gap-2 text-gray-700"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Account</span>
          </button>
        </>
      )}
    </div>
  );

  const renderRecipient = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          value={bankDetails.fullName}
          onChange={(e) => setBankDetails({ ...bankDetails, fullName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          placeholder="Chase Bank"
          value={bankDetails.bankName}
          onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          placeholder="123456789"
          value={bankDetails.accountNumber}
          onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="routingNumber">Routing Number</Label>
        <Input
          id="routingNumber"
          placeholder="021000021"
          value={bankDetails.routingNumber}
          onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
        />
      </div>

      <div>
        <Label>Account Type</Label>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setBankDetails({ ...bankDetails, accountType: 'checking' })}
            className={`flex-1 py-2 px-4 rounded-lg border ${
              bankDetails.accountType === 'checking'
                ? 'bg-[#163300] text-[#9FE870]'
                : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            Checking
          </button>
          <button
            onClick={() => setBankDetails({ ...bankDetails, accountType: 'savings' })}
            className={`flex-1 py-2 px-4 rounded-lg border ${
              bankDetails.accountType === 'savings'
                ? 'bg-[#163300] text-[#9FE870]'
                : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            Savings
          </button>
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-gray-700 mb-3">Address</p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              placeholder="123 Main St"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="NY"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="10001"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => setStep('amount')}
        disabled={
          !bankDetails.fullName ||
          !bankDetails.bankName ||
          !bankDetails.accountNumber ||
          !bankDetails.routingNumber ||
          !address.street ||
          !address.city ||
          !address.state ||
          !address.postalCode
        }
        className="w-full py-3 bg-[#9FE870] text-[#163300] rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );

  const renderAmount = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-4xl font-bold">$</span>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-4xl font-bold text-center border-none shadow-none focus-visible:ring-0"
          />
        </div>
        <p className="text-sm text-gray-600">Available: ${walletBalance.toFixed(2)} USDC</p>
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <button
        onClick={handleAmountSubmit}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full py-3 bg-[#9FE870] text-[#163300] rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );

  const renderReview = () => {
    const fiatAmount = parseFloat(amount || '0');
    const totalCost = fiatAmount + ACH_FEE;
    const recipientName = selectedAccount?.account_owner_name || bankDetails.fullName;
    const bankInfo = selectedAccount
      ? `${selectedAccount.bank_name} ••••${selectedAccount.account?.account_number.slice(-4)}`
      : `${bankDetails.bankName} ••••${bankDetails.accountNumber.slice(-4)}`;

    return (
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Sending to</p>
          <p className="font-semibold text-lg">{recipientName}</p>
          <p className="text-sm text-gray-600">{bankInfo}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Recipient gets</span>
            <span className="font-medium">${fiatAmount.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transfer fee</span>
            <span className="font-medium">${ACH_FEE.toFixed(2)} USDC</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">You&apos;ll send</span>
            <span className="font-semibold text-[#163300]">${totalCost.toFixed(2)} USDC</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-[#9FE870] text-[#163300] rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Confirm & Send'}
        </button>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="py-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163300] mx-auto mb-4"></div>
      <p className="text-gray-600">Processing your transfer...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="py-12 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold mb-2">Transfer Successful!</h3>
      <p className="text-gray-600 mb-6">Your money has been sent successfully</p>
      <button
        onClick={() => {
          onOpenChange(false);
          setStep('select_account');
          setAmount('');
          setError('');
        }}
        className="w-full py-3 bg-[#9FE870] text-[#163300] rounded-lg font-medium"
      >
        Done
      </button>
    </div>
  );


  const titles = {
    select_account: 'Select Account',
    recipient: 'Recipient Details',
    amount: 'Enter Amount',
    review: 'Review Transfer',
    processing: 'Processing',
    success: 'Success',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {step !== 'processing' && step !== 'success' && (
              <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <DialogTitle>{titles[step]}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {step === 'select_account' && renderSelectAccount()}
          {step === 'recipient' && renderRecipient()}
          {step === 'amount' && renderAmount()}
          {step === 'review' && renderReview()}
          {step === 'processing' && renderProcessing()}
          {step === 'success' && renderSuccess()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
