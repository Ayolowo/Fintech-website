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
import { ArrowLeft, Copy, Check, Info, Search } from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import {
  PaymentCountry,
  getDepositCountries,
  isMomoCurrency,
  getMethodLabel,
} from "@/data/paymentCountries";

type Step =
  | "country"
  | "input"
  | "review"
  | "accountInfo"
  | "bridgeInstructions"
  | "paytrieInstructions"
  | "processing"
  | "success";

interface VirtualAccountInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface BridgeDepositInstructions {
  bankName: string;
  accountNumber: string;
  routingNumber?: string;
  iban?: string;
  bic?: string;
  reference?: string;
  sortCode?: string;
  pixKey?: string;
  clabe?: string;
}

interface PaytrieInstructions {
  email: string;
  reference: string;
  rate: number;
}

interface AddMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const YC_PERCENTAGE_FEE = 0.007;

export function AddMoneyModal({ open, onOpenChange, onSuccess }: AddMoneyModalProps) {
  const { user } = usePrivy();
  const { getAuthToken } = useAuth();

  const [step, setStep] = useState<Step>("country");
  const [selectedCountry, setSelectedCountry] = useState<PaymentCountry | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // YellowCard result
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccountInfo | null>(null);
  // Bridge result
  const [bridgeInstructions, setBridgeInstructions] = useState<BridgeDepositInstructions | null>(null);
  // Paytrie result
  const [paytrieInstructions, setPaytrieInstructions] = useState<PaytrieInstructions | null>(null);

  const userEmail = user?.email?.address ?? "";
  const solanaWallet = user?.linkedAccounts?.find(
    (a: any) => a.type === "wallet" && a.chainType === "solana" && a.walletClientType === "privy"
  ) as any;

  const depositCountries = getDepositCountries();
  const filteredCountries = depositCountries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.currency.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Load exchange rate when country + amount step is reached
  const loadRate = useCallback(async () => {
    if (!selectedCountry) return;
    setLoadingRate(true);
    try {
      const token = await getAuthToken();

      if (selectedCountry.provider === 'yellowcard') {
        const res = await fetch(`/api/business/rates?currency=${selectedCountry.currency}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load rate");
        const data = await res.json();
        const rates = data.rates || data;
        const rate = rates.find((r: any) => r.code === selectedCountry.currency);
        if (!rate) throw new Error("Rate not found");
        setExchangeRate(rate.buy * (1 + YC_PERCENTAGE_FEE));
      } else if (selectedCountry.provider === 'bridge') {
        const res = await fetch(`/api/public/bridge/exchange-rates?currency=${selectedCountry.currency}`);
        if (!res.ok) throw new Error("Failed to load rate");
        const data = await res.json();
        // Bridge returns rate as fiat per USDC
        const rate = data.rate || data[selectedCountry.currency.toLowerCase()] || data.exchange_rate;
        setExchangeRate(rate);
      } else if (selectedCountry.provider === 'paytrie') {
        const res = await fetch(`/api/public/paytrie/price-quote?baseCurrency=CAD&quoteCurrency=USDC`);
        if (!res.ok) throw new Error("Failed to load rate");
        const data = await res.json();
        setExchangeRate(data.price || data.rate);
      }
      setCountdown(30);
    } catch {
      setError("Failed to load exchange rate");
    } finally {
      setLoadingRate(false);
    }
  }, [selectedCountry, getAuthToken]);

  useEffect(() => {
    if (open && step === "input" && selectedCountry) loadRate();
  }, [open, step, selectedCountry, loadRate]);

  // Countdown + auto-refresh on review step
  useEffect(() => {
    if (!open || step !== "review") return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { loadRate(); return 30; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open, step, loadRate]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("country");
        setSelectedCountry(null);
        setCountrySearch("");
        setAmount("");
        setError("");
        setExchangeRate(null);
        setVirtualAccount(null);
        setBridgeInstructions(null);
        setPaytrieInstructions(null);
      }, 300);
    }
  }, [open]);

  const handleBack = () => {
    if (step === "country") { onOpenChange(false); return; }
    if (step === "input") { setStep("country"); setAmount(""); setError(""); return; }
    if (step === "review") { setStep("input"); setError(""); return; }
    if (step === "accountInfo" || step === "bridgeInstructions" || step === "paytrieInstructions") {
      setStep("review");
    }
  };

  const calculateUSDReceived = (localAmount: number): number => {
    if (!exchangeRate || exchangeRate === 0) return 0;
    if (selectedCountry?.provider === 'paytrie') return localAmount * exchangeRate;
    return localAmount / exchangeRate;
  };

  const handleReview = () => {
    const parsed = parseFloat(amount);
    if (!amount || parsed <= 0) { setError("Please enter an amount"); return; }
    if (!exchangeRate) { setError("Exchange rate not loaded. Please wait."); return; }
    setError("");
    setStep("review");
  };

  const handleConfirm = async () => {
    if (!selectedCountry) return;
    setLoading(true);
    setStep("processing");
    setError("");

    try {
      const token = await getAuthToken();
      const parsedAmount = parseFloat(amount);

      if (selectedCountry.provider === 'yellowcard') {
        // Get channels for this country
        const channelsRes = await fetch(`/api/business/channels?country=${selectedCountry.code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!channelsRes.ok) throw new Error("Failed to load payment channels");
        const channelsData = await channelsRes.json();

        const depositChannels = channelsData.filter(
          (ch: any) => ch.country === selectedCountry.code && ch.rampType === "deposit" &&
            ch.status === "active" && (ch.apiStatus === "active" || ch.apiStatus === "enabled")
        );

        const isMomo = isMomoCurrency(selectedCountry.currency);
        const channel = isMomo
          ? (depositChannels.find((ch: any) => ch.channelType === "p2p") || depositChannels[0])
          : (depositChannels.find((ch: any) => ch.channelType === "p2p") ||
             depositChannels.find((ch: any) => ch.channelType === "bank") ||
             depositChannels[0]);

        if (!channel) throw new Error(`Bank transfer not available for ${selectedCountry.name}`);

        const sequenceId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const collectionPayload = {
          channelId: channel.id,
          sequenceId,
          currency: channel.countryCurrency || selectedCountry.currency,
          country: selectedCountry.code,
          localAmount: parsedAmount,
          userEmail,
          effectiveExchangeRate: exchangeRate,
          source: { accountType: isMomo ? "momo" : "bank" },
          forceAccept: true,
          customerType: "institution",
          customerUID: userEmail,
          directSettlement: true,
        };

        const collRes = await fetch(`/api/business/collections`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(collectionPayload),
        });
        if (!collRes.ok) {
          const errData = await collRes.json();
          throw new Error(errData.error || "Failed to create collection");
        }
        const collData = await collRes.json();
        const bankInfo = collData.bankInfo;
        if (!bankInfo?.accountNumber || !bankInfo?.name || !bankInfo?.accountName) {
          throw new Error("No account details received");
        }
        setVirtualAccount({ bankName: bankInfo.name, accountNumber: bankInfo.accountNumber, accountName: bankInfo.accountName });
        setStep("accountInfo");

      } else if (selectedCountry.provider === 'bridge') {
        // Bridge: initiate on-ramp — backend returns deposit instructions
        const depositRes = await fetch(`/api/business/deposit`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            currency: selectedCountry.currency,
            amount: parsedAmount,
            walletAddress: solanaWallet?.address,
            userEmail,
          }),
        });
        if (!depositRes.ok) {
          const errData = await depositRes.json();
          throw new Error(errData.error || "Failed to create deposit");
        }
        const depositData = await depositRes.json();
        // Map whatever the backend returns into our instructions shape
        const instructions = depositData.instructions || depositData;
        setBridgeInstructions({
          bankName: instructions.bank_name || instructions.bankName || "PayBridge Settlement Bank",
          accountNumber: instructions.account_number || instructions.accountNumber || "",
          routingNumber: instructions.routing_number || instructions.routingNumber,
          iban: instructions.iban,
          bic: instructions.bic || instructions.swift,
          reference: instructions.reference || instructions.memo,
          sortCode: instructions.sort_code || instructions.sortCode,
          pixKey: instructions.pix_key || instructions.pixKey,
          clabe: instructions.clabe,
        });
        setStep("bridgeInstructions");

      } else if (selectedCountry.provider === 'paytrie') {
        const quoteRes = await fetch(`/api/public/paytrie/price-quote?baseCurrency=CAD&quoteCurrency=USDC&baseAmount=${parsedAmount}`);
        if (!quoteRes.ok) throw new Error("Failed to get Paytrie quote");
        const quoteData = await quoteRes.json();
        setPaytrieInstructions({
          email: "paybridge@paytrie.com",
          reference: quoteData.reference || quoteData.id || `PB-${Date.now()}`,
          rate: exchangeRate!,
        });
        setStep("paytrieInstructions");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process. Please try again.");
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
    } catch {}
  };

  const handleDone = () => {
    setStep("success");
    setTimeout(() => { onOpenChange(false); onSuccess?.(); }, 2000);
  };

  // ── Renders ─────────────────────────────────────────────────────────────────

  const renderCountryPicker = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search country or currency..."
          value={countrySearch}
          onChange={e => setCountrySearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400"
          autoFocus
        />
      </div>
      <div className="space-y-1 max-h-[420px] overflow-y-auto">
        {filteredCountries.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No countries found</p>
        ) : filteredCountries.map(c => (
          <button
            key={`${c.code}-${c.currency}`}
            onClick={() => { setSelectedCountry(c); setCountrySearch(""); setStep("input"); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <CircleFlag countryCode={c.countryCode} height="28" width="28" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-500">{c.currency} · {getMethodLabel(c.currency)}</p>
            </div>
            <span className="text-xs font-semibold text-gray-400">{c.currencySymbol}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderInput = () => {
    if (!selectedCountry) return null;
    const usdEstimate = amount && exchangeRate ? calculateUSDReceived(parseFloat(amount)) : null;
    return (
      <div className="space-y-5">
        {/* Selected country pill */}
        <button
          onClick={() => setStep("country")}
          className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl w-full hover:bg-gray-200 transition-colors"
        >
          <CircleFlag countryCode={selectedCountry.countryCode} height="28" width="28" />
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-gray-900">{selectedCountry.name}</p>
            <p className="text-xs text-gray-500">{getMethodLabel(selectedCountry.currency)}</p>
          </div>
          <span className="text-xs text-gray-400">Change ›</span>
        </button>

        {/* Amount input */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Amount to send</label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={e => {
                const v = e.target.value.replace(/[^0-9.]/g, "");
                if (v.split(".").length <= 2) { setAmount(v); setError(""); }
              }}
              disabled={loadingRate}
              className="w-full text-2xl font-semibold p-4 pr-20 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none disabled:bg-gray-50"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-semibold text-gray-700">
              {selectedCountry.currency}
            </span>
          </div>
          {usdEstimate !== null && (
            <p className="text-xs text-gray-500 mt-1.5">
              ≈ ${usdEstimate.toFixed(2)} USD you receive
            </p>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

        <button
          onClick={handleReview}
          disabled={!amount || parseFloat(amount) <= 0 || loadingRate}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#9FE870', color: '#163300' }}
        >
          {loadingRate ? "Loading rate..." : "Continue"}
        </button>
      </div>
    );
  };

  const renderReview = () => {
    if (!selectedCountry || !exchangeRate) return null;
    const localAmount = parseFloat(amount || "0");
    const usdAmount = calculateUSDReceived(localAmount);

    return (
      <div className="space-y-5">
        <div>
          <label className="text-sm text-gray-500 mb-2 block">You send</label>
          <div className="relative">
            <input readOnly value={localAmount.toLocaleString()} className="w-full text-2xl font-semibold p-4 pr-20 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-gray-700">{selectedCountry.currency}</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-2 block">You receive</label>
          <div className="relative">
            <input readOnly value={usdAmount.toFixed(2)} className="w-full text-2xl font-semibold p-4 pr-16 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-gray-700">USD</span>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Exchange rate</span>
            <span className="text-gray-900">
              {selectedCountry.provider === 'paytrie'
                ? `1 CAD = ${exchangeRate.toFixed(4)} USDC`
                : `${selectedCountry.currencySymbol}${exchangeRate.toFixed(4)} = 1 USD`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Rate refreshes in</span>
            <span className="font-medium">{countdown}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment method</span>
            <span className="font-medium">{getMethodLabel(selectedCountry.currency)}</span>
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl flex gap-3">
          <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            {selectedCountry.provider === 'bridge'
              ? "You'll receive bank account details to deposit in the next step. USDC will be credited once we receive your transfer."
              : selectedCountry.provider === 'paytrie'
              ? "You'll send an Interac e-Transfer to PayBridge. USDC will be credited once confirmed."
              : "You'll receive bank account details to complete your transfer in the next step."}
          </p>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#9FE870', color: '#163300' }}
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    );
  };

  const renderCopyField = (label: string, value: string, fieldKey: string) => (
    <button
      onClick={() => handleCopy(value, fieldKey)}
      className="w-full p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="text-left">
          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
          <p className="font-semibold text-gray-900">{value}</p>
        </div>
        {copiedField === fieldKey
          ? <Check className="w-4 h-4 text-green-600 shrink-0" />
          : <Copy className="w-4 h-4 text-gray-400 shrink-0" />}
      </div>
    </button>
  );

  const renderAccountInfo = () => {
    if (!virtualAccount || !selectedCountry) return null;
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="w-full p-4 bg-white rounded-xl border border-gray-200 text-left">
            <p className="text-xs text-gray-500 mb-0.5">Bank Name</p>
            <p className="font-semibold text-gray-900">{virtualAccount.bankName}</p>
          </div>
          {renderCopyField("Account Number", virtualAccount.accountNumber, "account")}
          <div className="w-full p-4 bg-white rounded-xl border border-gray-200 text-left">
            <p className="text-xs text-gray-500 mb-0.5">Account Name</p>
            <p className="font-semibold text-gray-900">{virtualAccount.accountName}</p>
          </div>
        </div>
        <div className="p-4 bg-black rounded-xl flex gap-3">
          <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <p className="text-sm text-white leading-relaxed">
            Send exactly {selectedCountry.currencySymbol}{parseFloat(amount).toLocaleString()} {selectedCountry.currency} to the account above. Your name on the bank account must match your registered business name on PayBridge.
          </p>
        </div>
        <button onClick={handleDone} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#9FE870', color: '#163300' }}>
          Done
        </button>
      </div>
    );
  };

  const renderBridgeInstructions = () => {
    if (!bridgeInstructions || !selectedCountry) return null;
    const currency = selectedCountry.currency;
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Transfer {selectedCountry.currencySymbol}{parseFloat(amount).toLocaleString()} {currency} to the account below. USDC will be credited to your wallet once received.
        </p>
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 mb-0.5">Bank</p>
            <p className="font-semibold text-gray-900">{bridgeInstructions.bankName}</p>
          </div>
          {bridgeInstructions.iban && renderCopyField("IBAN", bridgeInstructions.iban, "iban")}
          {bridgeInstructions.accountNumber && !bridgeInstructions.iban && renderCopyField("Account Number", bridgeInstructions.accountNumber, "account")}
          {bridgeInstructions.routingNumber && renderCopyField("Routing Number", bridgeInstructions.routingNumber, "routing")}
          {bridgeInstructions.sortCode && renderCopyField("Sort Code", bridgeInstructions.sortCode, "sortCode")}
          {bridgeInstructions.bic && renderCopyField("BIC / SWIFT", bridgeInstructions.bic, "bic")}
          {bridgeInstructions.clabe && renderCopyField("CLABE", bridgeInstructions.clabe, "clabe")}
          {bridgeInstructions.pixKey && renderCopyField("PIX Key", bridgeInstructions.pixKey, "pix")}
          {bridgeInstructions.reference && renderCopyField("Reference / Memo", bridgeInstructions.reference, "ref")}
        </div>
        <div className="p-4 bg-gray-100 rounded-xl flex gap-3">
          <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">Include the reference code exactly as shown. Transfers without the correct reference may be delayed.</p>
        </div>
        <button onClick={handleDone} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#9FE870', color: '#163300' }}>
          Done
        </button>
      </div>
    );
  };

  const renderPaytrieInstructions = () => {
    if (!paytrieInstructions) return null;
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Send an Interac e-Transfer of CA${parseFloat(amount).toLocaleString()} to the details below.
        </p>
        <div className="space-y-3">
          {renderCopyField("Send to email", paytrieInstructions.email, "paytrie-email")}
          {renderCopyField("Message / Reference", paytrieInstructions.reference, "paytrie-ref")}
        </div>
        <div className="p-4 bg-gray-100 rounded-xl flex gap-3">
          <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">Include the reference exactly as shown in your Interac message field. USDC will be credited within minutes of confirmation.</p>
        </div>
        <button onClick={handleDone} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#9FE870', color: '#163300' }}>
          Done
        </button>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="py-16 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163300] mx-auto mb-4" />
      <p className="text-gray-600">Creating deposit...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold mb-2">Instructions Sent!</h3>
      <p className="text-gray-500 text-sm">Complete the transfer to receive USDC in your wallet.</p>
    </div>
  );

  const titles: Record<Step, string> = {
    country: "Add Money",
    input: selectedCountry ? `Add ${selectedCountry.currency}` : "Add Money",
    review: "Review Deposit",
    accountInfo: "Bank Transfer Details",
    bridgeInstructions: "Deposit Instructions",
    paytrieInstructions: "Interac e-Transfer",
    processing: "Processing",
    success: "Success",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {step !== "processing" && step !== "success" && (
              <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <DialogTitle>{titles[step]}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="mt-2">
          {step === "country" && renderCountryPicker()}
          {step === "input" && renderInput()}
          {step === "review" && renderReview()}
          {step === "accountInfo" && renderAccountInfo()}
          {step === "bridgeInstructions" && renderBridgeInstructions()}
          {step === "paytrieInstructions" && renderPaytrieInstructions()}
          {step === "processing" && renderProcessing()}
          {step === "success" && renderSuccess()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
