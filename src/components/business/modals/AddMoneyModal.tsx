"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Copy, Check, Info } from "lucide-react";
import { CircleFlag } from "react-circle-flags";

type Step = "input" | "review" | "accountInfo" | "processing" | "success";

interface ExchangeRate {
  from_currency: string;
  rate: number;
  fee: number;
  total_cost: number;
  expires_at: string;
}

// Nigerian collection fee - only percentage, no minimum
const NGN_PERCENTAGE_FEE = 0.007; // 0.7% (0.5% YellowCard + 0.2% partner)

interface CollectionRequest {
  channelId: string;
  sequenceId: string;
  currency: string; // lowercase to match Go backend struct tags
  country: string; // lowercase to match Go backend struct tags
  localAmount: number;
  userEmail: string; // Backend uses this to fetch KYC and build institution metadata
  networkName?: string;
  effectiveExchangeRate: number;
  source: {
    accountType: "bank" | "momo";
    accountNumber?: string;
    networkId?: string;
  };
  forceAccept: boolean;
  customerType: "institution" | "retail";
  customerUID: string;
  directSettlement: boolean;
}

interface VirtualAccountInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface AddMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const MIN_NGN_AMOUNT = 2500;
const MAX_NGN_AMOUNT = 30000000;

export function AddMoneyModal({
  open,
  onOpenChange,
  onSuccess,
}: AddMoneyModalProps) {
  const { user } = usePrivy();
  const { getAuthToken } = useAuth();

  const [step, setStep] = useState<Step>("input");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const [virtualAccount, setVirtualAccount] =
    useState<VirtualAccountInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  const userEmail = user?.email?.address || "";
  const solanaWallet = user?.linkedAccounts?.find(
    (account: any) =>
      account.type === "wallet" &&
      account.chainType === "solana" &&
      account.walletClientType === "privy",
  ) as any;

  // Load exchange rate
  const loadRate = useCallback(async () => {
    setLoadingRate(true);
    try {
      const token = await getAuthToken();

      // Get rates for NGN
      const response = await fetch(
        `/api/business/rates?currency=NGN`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load exchange rate");
      }

      const ratesData = await response.json();

      // API returns { rates: [...] } format
      const rates = ratesData.rates || ratesData;

      // Find the NGN rate
      const ngnRate = rates.find((r: any) => r.code === "NGN");

      if (!ngnRate) {
        throw new Error("NGN rate not found");
      }

      // For adding money, use the buy rate and apply 0.7% markup
      const baseRate = ngnRate.buy;
      const markedUpRate = baseRate * (1 + NGN_PERCENTAGE_FEE);

      setExchangeRate({
        from_currency: "NGN",
        rate: markedUpRate,
        fee: 0,
        total_cost: 0,
        expires_at: new Date(Date.now() + 30 * 1000).toISOString(),
      });

      // Reset countdown to 30 seconds
      setCountdown(30);
    } catch (error) {
      console.error("Failed to load exchange rate:", error);
    } finally {
      setLoadingRate(false);
    }
  }, [getAuthToken]);

  // Load exchange rate when modal opens
  useEffect(() => {
    if (!open) return;
    loadRate();
  }, [open, getAuthToken, loadRate]);

  // Countdown timer and auto-refresh rate
  useEffect(() => {
    if (!open || step !== "review") return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Refresh the rate
          loadRate();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, step, loadRate]);

  const handleBack = () => {
    if (step === "input") {
      onOpenChange(false);
    } else if (step === "review") {
      setStep("input");
    } else if (step === "accountInfo") {
      setStep("review");
    }
  };

  /**
   * Calculate USD amount user will receive
   * The rate already includes the 0.7% markup, so just divide
   */
  const calculateUSDReceived = (ngnAmount: number): number => {
    if (!exchangeRate || !exchangeRate.rate) return 0;

    // Simply divide by the marked-up rate
    const usdAmount = ngnAmount / exchangeRate.rate;
    return usdAmount;
  };

  const handleReview = async () => {
    const ngnAmount = parseFloat(amount);

    if (!amount || ngnAmount <= 0) {
      setError("Please enter an amount");
      return;
    }

    if (ngnAmount < MIN_NGN_AMOUNT) {
      setError(`Minimum amount is ₦${MIN_NGN_AMOUNT.toLocaleString()}`);
      return;
    }

    if (ngnAmount > MAX_NGN_AMOUNT) {
      setError(`Maximum amount is ₦${MAX_NGN_AMOUNT.toLocaleString()}`);
      return;
    }

    // Check if exchange rate is loaded
    if (!exchangeRate) {
      setError("Exchange rate not loaded. Please try again.");
      return;
    }

    setError("");
    setStep("review");
  };

  const handleConfirm = async () => {
    if (!solanaWallet || !userEmail) {
      setError("Missing wallet or email information");
      return;
    }

    setLoading(true);
    setStep("processing");
    setError("");

    try {
      const token = await getAuthToken();

      // First, get available channels using the correct endpoint
      const channelsResponse = await fetch(
        `/api/business/channels?country=NG`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!channelsResponse.ok) {
        const errorText = await channelsResponse.text();
        console.error("Failed to load channels:", errorText);
        throw new Error("Failed to load payment channels");
      }

      const channelsData = await channelsResponse.json();

      // Filter for deposit channels that are active for Nigeria
      const depositChannels = channelsData.filter(
        (ch: any) =>
          ch.country === "NG" &&
          ch.rampType === "deposit" &&
          ch.status === "active" &&
          (ch.apiStatus === "active" || ch.apiStatus === "enabled")
      );

      // Find bank transfer channel (p2p or bank) - p2p is preferred for Nigeria
      const channel = depositChannels.find(
        (ch: any) => ch.channelType === "p2p"
      ) || depositChannels.find(
        (ch: any) => ch.channelType === "bank"
      );

      if (!channel) {
        console.error("Available channels:", depositChannels);
        throw new Error("Bank transfer not available for Nigeria");
      }

      // Generate UUID for sequence ID
      const sequenceId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Calculate the marked up exchange rate (with 0.7% fee included)
      const userFacingRate = exchangeRate.rate;

      // Create collection request matching backend Go struct (lowercase fields)
      const collectionPayload = {
        channelId: channel.id,
        sequenceId,
        currency: channel.countryCurrency || "NGN",
        country: "NG",
        localAmount: parseFloat(amount), // Local currency amount in NGN
        userEmail: userEmail, // Backend uses this to fetch KYC profile and build institution metadata
        networkName: undefined, // Only needed for mobile money
        effectiveExchangeRate: userFacingRate, // User-facing rate with fees included
        source: {
          accountType: "bank", // Bank transfer for Nigeria
        },
        forceAccept: true,
        customerType: "institution", // Explicitly set for business users
        customerUID: userEmail,
        directSettlement: true, // Enable direct settlement to user's Solana wallet
      };

      const collectionResponse = await fetch(
        `/api/business/collections`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(collectionPayload),
        },
      );

      if (!collectionResponse.ok) {
        const errorData = await collectionResponse.json();
        throw new Error(errorData.error || "Failed to create collection");
      }

      const collectionData = await collectionResponse.json();

      // Extract bank account details from YellowCard response
      // YellowCard returns bank details in the bankInfo field
      const bankInfo = collectionData.bankInfo;

      if (!bankInfo || !bankInfo.accountNumber || !bankInfo.name || !bankInfo.accountName) {
        throw new Error("No account details received");
      }

      setVirtualAccount({
        bankName: bankInfo.name,
        accountNumber: bankInfo.accountNumber,
        accountName: bankInfo.accountName,
      });

      setStep("accountInfo");
    } catch (error: any) {
      setError(error.message || "Failed to create deposit. Please try again.");
      setStep("review");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDone = () => {
    setStep("success");
    setTimeout(() => {
      onOpenChange(false);
      setStep("input");
      setAmount("");
      setError("");
      setVirtualAccount(null);
      onSuccess?.();
    }, 2000);
  };

  const renderInput = () => {
    return (
      <div className="space-y-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900">
          How much would you like to add?
        </h2>

        {/* Country Selector */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl">
          <CircleFlag countryCode="ng" height="32" width="32" />
          <span className="text-base font-medium text-gray-900">Nigeria</span>
        </div>

        {/* Amount Input */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Amount</label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                const parts = value.split(".");
                if (parts.length <= 2) {
                  setAmount(value);
                  setError("");
                }
              }}
              disabled={loadingRate}
              className="w-full text-2xl font-semibold p-4 pr-16 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-900">
              NGN
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Limits */}
        <div className="p-4 bg-gray-200 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-900">Minimum</span>
            <span className="font-semibold text-gray-900">
              ₦{MIN_NGN_AMOUNT.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-900">Maximum</span>
            <span className="font-semibold text-gray-900">
              ₦{MAX_NGN_AMOUNT.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleReview}
          disabled={
            !amount ||
            parseFloat(amount) <= 0 ||
            parseFloat(amount) < MIN_NGN_AMOUNT ||
            parseFloat(amount) > MAX_NGN_AMOUNT
          }
          className="w-full py-3 bg-[#9FE870] text-[#163300] rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  };

  const renderReview = () => {
    const ngnAmount = parseFloat(amount || "0");
    const usdAmount = calculateUSDReceived(ngnAmount);

    return (
      <div className="space-y-6">
        {/* You Send */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">You send</label>
          <div className="relative">
            <input
              type="text"
              value={ngnAmount.toLocaleString()}
              readOnly
              className="w-full text-2xl font-semibold p-4 pr-16 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-900">
              NGN
            </span>
          </div>
        </div>

        {/* You Receive */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">
            You receive
          </label>
          <div className="relative">
            <input
              type="text"
              value={usdAmount.toFixed(8)}
              readOnly
              className="w-full text-2xl font-semibold p-4 pr-16 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-900">
              USD
            </span>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Exchange Rate</span>
            <div className="flex items-center gap-2 text-black">
              <span>₦ {exchangeRate?.rate.toFixed(4)} = 1 USD</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Rate updates in</span>
            <span className="text-black font-medium">{countdown}s</span>
          </div>
        </div>

        <div className="p-4 bg-gray-200 rounded-lg flex gap-3">
          <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-900">
            You&apos;ll receive bank account details to complete your transfer in the
            next step.
          </p>
        </div>

        {error && <p className="text-sm text-red-300 text-center">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-3 bg-[#9FE870] text-[#163300] rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    );
  };

  const renderAccountInfo = () => {
    if (!virtualAccount) return null;

    return (
      <div className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-lg space-y-4">
          <div className="w-full p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Bank Name</p>
            <p className="font-semibold text-lg">{virtualAccount.bankName}</p>
          </div>

          <button
            onClick={() => handleCopy(virtualAccount.accountNumber, "account")}
            className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <p className="font-semibold text-lg">
                  {virtualAccount.accountNumber}
                </p>
              </div>
              {copiedField === "account" ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          <div className="w-full p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Account Name</p>
            <p className="font-semibold text-lg">{virtualAccount.accountName}</p>
          </div>
        </div>

        <div className="p-4 bg-black rounded-lg">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white leading-relaxed">
              Send exactly NGN {parseFloat(amount).toLocaleString()} to the bank
              account above. Once you&apos;ve completed the transfer, tap &apos;Done&apos;
              below. It will be automatically deposited into your wallet. Note:
              Name on Bank Account must match your registered name on PayBridge
            </p>
          </div>
        </div>

        <button
          onClick={handleDone}
          className="w-full py-3 bg-[#9FE870] text-[#163300] rounded-lg font-medium"
        >
          Done
        </button>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="py-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163300] mx-auto mb-4"></div>
      <p className="text-gray-600">Creating deposit...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="py-12 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold mb-2">Instructions Sent!</h3>
      <p className="text-gray-600">
        Complete the bank transfer to receive the equivalent of USD in your
        wallet
      </p>
    </div>
  );

  const titles = {
    review: "Review Deposit",
    accountInfo: "Bank Transfer Details",
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
          {step === "input" && renderInput()}
          {step === "review" && renderReview()}
          {step === "accountInfo" && renderAccountInfo()}
          {step === "processing" && renderProcessing()}
          {step === "success" && renderSuccess()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
