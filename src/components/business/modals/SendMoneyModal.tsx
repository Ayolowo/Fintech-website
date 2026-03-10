"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets, useSignTransaction } from "@privy-io/react-auth/solana";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { transferUSDC } from "@/lib/solana/transferUSDC";

// US States
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

type Step =
  | "transfer_type"
  | "select_account"
  | "recipient"
  | "amount"
  | "review"
  | "processing"
  | "success";

type TransferType = "ach" | "wire";

interface BankAccountDetails {
  fullName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: "checking" | "savings";
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

const ACH_FEE = 10; // $10 fee for ACH transfers
const WIRE_FEE = 15; // $15 fee for wire transfers

export function SendMoneyModal({
  open,
  onOpenChange,
  walletBalance,
  onSuccess,
}: SendMoneyModalProps) {
  const router = useRouter();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { signTransaction } = useSignTransaction();
  const { getAuthToken } = useAuth();

  const [step, setStep] = useState<Step>("transfer_type");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transferType, setTransferType] = useState<TransferType>("ach");

  // Account selection
  const [externalAccounts, setExternalAccounts] = useState<
    BridgeExternalAccount[]
  >([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccount, setSelectedAccount] =
    useState<BridgeExternalAccount | null>(null);

  const [savingAccount, setSavingAccount] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);

  // New account details
  const [bankDetails, setBankDetails] = useState<BankAccountDetails>({
    fullName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking",
    bankName: "",
  });
  const [address, setAddress] = useState<AddressDetails>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  // Wire message (optional, max 140 chars)
  const [wireMessage, setWireMessage] = useState("");

  // Amount
  const [amount, setAmount] = useState("");

  const userEmail = user?.email?.address || "";

  // Get the embedded wallet (Privy's way)
  const embeddedWallet = wallets.find((w) => w.standardWallet && w.standardWallet.name === "Privy");

  // Get wallet address for display/API calls
  const walletAddress = embeddedWallet?.address || "";

  // Load external accounts
  useEffect(() => {
    if (!open || step !== "select_account") return;

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
          },
        );

        if (response.ok) {
          const data = await response.json();
          setExternalAccounts(data.data || []);
        }
      } catch {
        setExternalAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    };

    loadAccounts();
  }, [open, step, userEmail, getAuthToken]);

  const currentFee = transferType === "wire" ? WIRE_FEE : ACH_FEE;

  const handleBack = () => {
    if (step === "transfer_type") {
      onOpenChange(false);
    } else if (step === "select_account") {
      setStep("transfer_type");
    } else if (step === "recipient") {
      setStep("select_account");
    } else if (step === "amount") {
      if (selectedAccount) {
        setStep("select_account");
      } else {
        setStep("recipient");
      }
    } else if (step === "review") {
      setStep("amount");
    }
  };

  const handleAmountSubmit = () => {
    const fiatAmount = parseFloat(amount);

    if (!amount || fiatAmount <= 0) {
      setError("Please enter an amount");
      return;
    }

    if (fiatAmount < 1) {
      setError("Minimum amount is $1.00");
      return;
    }

    const totalCost = fiatAmount + currentFee;
    if (totalCost > walletBalance) {
      setError("Insufficient balance to cover amount and fee");
      return;
    }

    setError("");
    setStep("review");
  };

  const handleRecipientSubmit = async () => {
    setSavingAccount(true);
    setError("");

    try {
      const token = await getAuthToken();
      const response = await fetch(`/api/bridge/external-accounts/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          currency: "usd",
          bank_name: bankDetails.bankName,
          account_owner_name: bankDetails.fullName,
          account_type: "us",
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to save account. Please try again.");
      }

      const accountData = await response.json();

      // Set as selected account for the transfer
      setSelectedAccount({
        id: accountData.id,
        customer_id: accountData.customer_id,
        currency: accountData.currency,
        account_owner_name: bankDetails.fullName,
        bank_name: bankDetails.bankName,
        account: {
          account_number: bankDetails.accountNumber,
          routing_number: bankDetails.routingNumber,
        },
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
      });

      // Show confirmation briefly then advance
      setAccountSaved(true);
      setTimeout(() => {
        setAccountSaved(false);
        setSavingAccount(false);
        setStep("amount");
      }, 1500);
    } catch (err: any) {
      setError("Failed to save account. Please try again.");
      setSavingAccount(false);
    }
  };

  const handleSubmit = async () => {
    if (!embeddedWallet) {
      setError("Missing wallet information");
      return;
    }

    setLoading(true);
    setStep("processing");
    setError("");

    try {
      const externalAccountId = selectedAccount!.id;
      const fiatAmount = parseFloat(amount);
      const token = await getAuthToken();
      const recipientName = selectedAccount!.account_owner_name;

      if (transferType === "wire") {
        // --- Wire flow: use Liquidation Addresses API ---

        // 1. Fetch fee wallet address
        const feeWalletResponse = await fetch(`/api/bridge/fee-wallet`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!feeWalletResponse.ok) {
          throw new Error("Transfer failed. Please try again.");
        }
        const { fee_wallet: feeWalletAddress } = await feeWalletResponse.json();

        // 2. Create liquidation address with wire message
        const liqResponse = await fetch(`/api/bridge/liquidation-address/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            wallet_address: walletAddress,
            external_account_id: externalAccountId,
            destination_wire_message: wireMessage.trim(),
          }),
        });

        if (!liqResponse.ok) {
          const errorData = await liqResponse.json();
          throw new Error("Transfer failed. Please try again.");
        }

        const liqData = await liqResponse.json();

        // 3. Send transfer amount USDC to Bridge liquidation address
        const txSignature = await transferUSDC(
          liqData.address,
          fiatAmount.toFixed(2),
          embeddedWallet,
          getAuthToken,
          async (params) => signTransaction({
            ...params,
            options: { uiOptions: { showWalletUIs: false } },
          })
        );

        // 4. Send $15 fee USDC to PayBridge fee wallet
        await transferUSDC(
          feeWalletAddress,
          WIRE_FEE.toFixed(2),
          embeddedWallet,
          getAuthToken,
          async (params) => signTransaction({
            ...params,
            options: { uiOptions: { showWalletUIs: false } },
          })
        );

        // 5. Save transaction record
        await fetch(`/api/business/transactions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: walletAddress,
            recipient_name: recipientName,
            recipient_bank_name:
              selectedAccount?.bank_name || bankDetails.bankName,
            recipient_account_number:
              selectedAccount?.account?.account_number ||
              bankDetails.accountNumber,
            recipient_routing_number:
              selectedAccount?.account?.routing_number ||
              bankDetails.routingNumber,
            recipient_address_street: address.street || "",
            recipient_address_city: address.city || "",
            recipient_address_state: address.state || "",
            recipient_address_postal_code: address.postalCode || "",
            recipient_address_country: address.country || "US",
            amount_usdc: fiatAmount + WIRE_FEE,
            amount_fiat: fiatAmount,
            fiat_currency: "USD",
            exchange_rate: 1.0,
            payment_method: "wire",
            bridge_transaction_id: liqData.id,
            bridge_deposit_address: liqData.address,
            bridge_deposit_amount: fiatAmount.toFixed(2),
            transaction_hash: txSignature.signature,
            status: "pending",
          }),
        });
      } else {
        // --- ACH flow: existing Transfers API (unchanged) ---
        const totalCost = fiatAmount + currentFee;

        const withdrawalResponse = await fetch(`/api/bridge/withdrawal/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            wallet_address: walletAddress,
            amount_usdc: totalCost.toFixed(2),
            currency: "usd",
            external_account_id: externalAccountId,
            developer_fee: currentFee.toFixed(2),
            payment_rail: "ach_same_day",
          }),
        });

        if (!withdrawalResponse.ok) {
          const errorData = await withdrawalResponse.json();
          throw new Error("Transfer failed. Please try again.");
        }

        const transfer = await withdrawalResponse.json();

        // Send USDC on-chain to Bridge deposit address
        const txSignature = await transferUSDC(
          transfer.deposit_address,
          transfer.deposit_amount.toString(),
          embeddedWallet,
          getAuthToken,
          async (params) => signTransaction({
            ...params,
            options: { uiOptions: { showWalletUIs: false } },
          })
        );

        // Save transaction to business_transactions table
        await fetch(`/api/business/transactions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: walletAddress,
            recipient_name: recipientName,
            recipient_bank_name:
              selectedAccount?.bank_name || bankDetails.bankName,
            recipient_account_number:
              selectedAccount?.account?.account_number ||
              bankDetails.accountNumber,
            recipient_routing_number:
              selectedAccount?.account?.routing_number ||
              bankDetails.routingNumber,
            recipient_address_street: address.street || "",
            recipient_address_city: address.city || "",
            recipient_address_state: address.state || "",
            recipient_address_postal_code: address.postalCode || "",
            recipient_address_country: address.country || "US",
            amount_usdc: totalCost,
            amount_fiat: fiatAmount,
            fiat_currency: "USD",
            exchange_rate: 1.0,
            payment_method: "ach",
            bridge_transaction_id: transfer.transfer_id,
            bridge_deposit_address: transfer.deposit_address,
            bridge_deposit_amount: transfer.deposit_amount,
            transaction_hash: txSignature.signature,
            status: "pending",
          }),
        });
      }

      setStep("success");
      onSuccess?.();
    } catch (error: any) {
      setError("Transfer failed. Please try again.");
      setStep("review");
    } finally {
      setLoading(false);
    }
  };

  const renderTransferType = () => (
    <div className="space-y-4">
      <p className="text-sm text-black/60">Choose how you want to send money</p>

      <button
        onClick={() => {
          setTransferType("ach");
          setStep("select_account");
        }}
        className="w-full p-5 bg-white border-2 border-gray-200 hover:border-black rounded-xl text-left transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-black text-base">To a Bank Account</p>
            <p className="text-sm text-black/60 mt-1">$10 fee</p>
          </div>
          <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      <button
        onClick={() => {
          setTransferType("wire");
          setStep("select_account");
        }}
        className="w-full p-5 bg-white border-2 border-gray-200 hover:border-black rounded-xl text-left transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-black text-base">To a Copart Account</p>
            <p className="text-sm text-black/60 mt-1">$15 fee</p>
          </div>
          <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  );

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
              <p className="text-sm font-medium text-black/70">
                Saved Accounts
              </p>
              {externalAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    setSelectedAccount(account);
                    setStep("amount");
                  }}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between text-left"
                >
                  <div>
                    <p className="font-medium text-black">
                      {account.account_owner_name}
                    </p>
                    <p className="text-sm text-black/60">
                      {account.bank_name} ••••
                      {account.account?.account_number.slice(-4)}
                    </p>
                  </div>
                  <div className="text-black/40">→</div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setSelectedAccount(null);
              setStep("recipient");
            }}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center justify-center gap-2 text-black/70"
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
          onChange={(e) =>
            setBankDetails({ ...bankDetails, fullName: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          placeholder="Chase Bank"
          value={bankDetails.bankName}
          onChange={(e) =>
            setBankDetails({ ...bankDetails, bankName: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          placeholder="123456789"
          value={bankDetails.accountNumber}
          onChange={(e) =>
            setBankDetails({ ...bankDetails, accountNumber: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="routingNumber">Routing Number</Label>
        <Input
          id="routingNumber"
          placeholder="021000021"
          value={bankDetails.routingNumber}
          onChange={(e) =>
            setBankDetails({ ...bankDetails, routingNumber: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Account Type</Label>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() =>
              setBankDetails({ ...bankDetails, accountType: "checking" })
            }
            className={`flex-1 py-2 px-4 rounded-lg border ${
              bankDetails.accountType === "checking"
                ? "bg-[#163300] text-[#9FE870]"
                : "bg-gray-50 text-black/70 border-gray-200"
            }`}
          >
            Checking
          </button>
          <button
            onClick={() =>
              setBankDetails({ ...bankDetails, accountType: "savings" })
            }
            className={`flex-1 py-2 px-4 rounded-lg border ${
              bankDetails.accountType === "savings"
                ? "bg-[#163300] text-[#9FE870]"
                : "bg-gray-50 text-black/70 border-gray-200"
            }`}
          >
            Savings
          </button>
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-black/70 mb-3">Address</p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              placeholder="123 Main St"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select
                value={address.state}
                onValueChange={(value) =>
                  setAddress({ ...address, state: value })
                }
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="10001"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      {accountSaved ? (
        <div className="w-full py-3 bg-green-100 text-green-700 rounded-lg font-medium text-center flex items-center justify-center gap-2">
          <Check className="w-5 h-5" />
          Account details saved!
        </div>
      ) : (
        <button
          onClick={handleRecipientSubmit}
          disabled={
            savingAccount ||
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
          {savingAccount ? "Saving account..." : "Continue"}
        </button>
      )}
    </div>
  );

  const renderAmount = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-md text-black-50 mb-8">
          Available balance: ${walletBalance.toFixed(4)}
        </p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-4xl font-bold">$</span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-4xl font-bold text-center border-none outline-none bg-transparent w-[300px]"
          />
        </div>
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
    const fiatAmount = parseFloat(amount || "0");
    const totalCost = fiatAmount + currentFee;
    const recipientName = selectedAccount?.account_owner_name || bankDetails.fullName;
    const bankInfo = selectedAccount
      ? `${selectedAccount.bank_name} ••••${selectedAccount.account?.account_number.slice(-4)}`
      : `${bankDetails.bankName} ••••${bankDetails.accountNumber.slice(-4)}`;

    return (
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-black/60 mb-1">Sending to</p>
          <p className="font-semibold text-lg">{recipientName}</p>
          <p className="text-sm text-black/60">{bankInfo}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-black/60">Recipient gets</span>
            <span className="font-medium">${fiatAmount.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/60">Transfer amount</span>
            <span className="font-medium">${fiatAmount.toFixed(2)} USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/60">
              {transferType === "wire" ? "Wire transfer fee" : "ACH transfer fee"}
            </span>
            <span className="font-medium">${currentFee.toFixed(2)} USDC</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold text-[#163300]">
              ${totalCost.toFixed(2)} USDC
            </span>
          </div>
        </div>

        {transferType === "wire" && (
          <div>
            <p className="text-sm font-medium text-black mb-1">Wire message (optional)</p>
            <p className="text-xs text-black/60 mb-2">
              This message will be sent with your wire transfer. Max 140 characters.
            </p>
            <textarea
              placeholder="Add a message for the recipient"
              value={wireMessage}
              onChange={(e) => {
                if (e.target.value.length <= 140) {
                  setWireMessage(e.target.value);
                }
              }}
              maxLength={140}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-black/30 resize-none"
            />
            <p className="text-xs text-black/40 text-right mt-1">{wireMessage.length}/140</p>
          </div>
        )}

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-[#9FE870] text-[#163300] rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Confirm & Send"}
        </button>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="py-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163300] mx-auto mb-4"></div>
      <p className="text-black/60">Processing your transfer...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="py-12 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold mb-2">Transfer Successful!</h3>
      <p className="text-black/60 mb-6">
        Your money has been sent successfully
      </p>
      <button
        onClick={() => {
          onOpenChange(false);
          setStep("transfer_type");
          setAmount("");
          setWireMessage("");
          setError("");
          setSavingAccount(false);
          setAccountSaved(false);
          setSelectedAccount(null);
        }}
        className="w-full py-3 bg-[#9FE870] text-[#163300] rounded-lg font-medium"
      >
        Done
      </button>
    </div>
  );

  const titles: Record<Step, string> = {
    transfer_type: "Send Money",
    select_account: "Select Account",
    recipient: "Recipient Details",
    amount: "Enter Amount",
    review: "Review Transfer",
    processing: "Processing",
    success: "Success",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {step !== "processing" && step !== "success" && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <DialogTitle>{titles[step]}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {step === "transfer_type" && renderTransferType()}
          {step === "select_account" && renderSelectAccount()}
          {step === "recipient" && renderRecipient()}
          {step === "amount" && renderAmount()}
          {step === "review" && renderReview()}
          {step === "processing" && renderProcessing()}
          {step === "success" && renderSuccess()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
