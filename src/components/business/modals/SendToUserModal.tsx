"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { ArrowLeft, Search, Check, Loader2 } from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import { transferUSDC } from "@/lib/solana/transferUSDC";
import { allPaymentCountries, type PaymentCountry } from "@/data/paymentCountries";

// ── Verified badge ────────────────────────────────────────────────────────────

const VerifiedBadge = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    style={{ position: "absolute", top: -3, right: -3, zIndex: 10, filter: "drop-shadow(0 0 1px white)" }}
  >
    <path
      d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z"
      fill="#1D9BF0"
    />
    <path d="M9.5 12.5l2 2 4-5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Avatar = ({ name, avatarUrl, verified, size = 40 }: { name: string; avatarUrl: string | null; verified: boolean; size?: number }) => {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{ width: size, height: size, borderRadius: "50%", backgroundColor: "#163300", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
        className="text-white font-bold"
      >
        {avatarUrl
          ? <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: size * 0.38 }}>{initials}</span>
        }
      </div>
      {verified && <VerifiedBadge size={Math.max(size * 0.42, 16)} />}
    </div>
  );
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = "search" | "currency" | "amount" | "review" | "processing" | "success";

interface PayBridgeUser {
  name: string;
  avatar_url: string | null;
  wallet_address: string;
  paytag: string | null;
  is_verified: boolean;
}

interface SendToUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
  onSuccess?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SendToUserModal({ open, onOpenChange, walletBalance, onSuccess }: SendToUserModalProps) {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { signTransaction } = useSignTransaction();
  const { getAuthToken } = useAuth();

  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PayBridgeUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PayBridgeUser | null>(null);

  const [currencySearch, setCurrencySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<PaymentCountry | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txSignature, setTxSignature] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const embeddedWallet = wallets.find(w => w.standardWallet?.name === "Privy");
  const walletAddress = embeddedWallet?.address ?? "";

  // All currencies a user could want to send in
  const allCurrencies = allPaymentCountries;
  const filteredCurrencies = allCurrencies.filter(c =>
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.currency.toLowerCase().includes(currencySearch.toLowerCase())
  );

  // Load exchange rate when currency is selected
  const loadRate = useCallback(async () => {
    if (!selectedCountry) return;
    setLoadingRate(true);
    setError("");
    try {
      const token = await getAuthToken();
      if (selectedCountry.currency === "USD") {
        setExchangeRate(1.0);
      } else if (selectedCountry.provider === "yellowcard") {
        const res = await fetch(`/api/business/rates?currency=${selectedCountry.currency}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load rate");
        const data = await res.json();
        const rates = data.rates || data;
        const rate = rates.find((r: any) => r.code === selectedCountry.currency);
        if (!rate) throw new Error("Rate not found");
        // sell rate: local per 1 USD — user enters local amount, we divide to get USDC
        setExchangeRate(rate.sell * (1 - 0.007));
      } else if (selectedCountry.provider === "bridge") {
        const res = await fetch(`/api/public/bridge/exchange-rates?currency=${selectedCountry.currency.toLowerCase()}&direction=usd_to_fiat`);
        if (!res.ok) throw new Error("Failed to load rate");
        const data = await res.json();
        const rate = data.buy_rate || data.midmarket_rate || data.sell_rate;
        if (!rate) throw new Error("Rate not found");
        setExchangeRate(rate);
      } else if (selectedCountry.provider === "paytrie") {
        const res = await fetch(`/api/public/paytrie/price-quote?leftSideLabel=CAD&leftSideValue=1&rightSideLabel=USDC`);
        if (!res.ok) throw new Error("Failed to load rate");
        const data = await res.json();
        // price = USDC per 1 CAD, so to convert CAD → USDC: divide by (1/price) = multiply by price
        // but we want USDC cost: cadAmount / (1/price) = cadAmount * price ... actually rate = USDC/CAD
        // USDC needed = cadAmount / (1/rate) ... let's store as fiat-per-usd for consistency:
        // 1 USDC = (1/data.price) CAD, so rate = 1/data.price (CAD per USDC)
        setExchangeRate(data.price ? 1 / data.price : null);
      }
    } catch {
      setError("Failed to load exchange rate");
    } finally {
      setLoadingRate(false);
    }
  }, [selectedCountry, getAuthToken]);

  useEffect(() => {
    if (open && step === "amount" && selectedCountry) loadRate();
  }, [open, step, selectedCountry, loadRate]);

  // Debounced user search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const token = await getAuthToken();
        const params = new URLSearchParams({ name: query.trim() });
        if (walletAddress) params.set("current_wallet", walletAddress);
        const res = await fetch(`/api/search-user?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, walletAddress, getAuthToken]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("search");
        setQuery("");
        setResults([]);
        setSelectedUser(null);
        setSelectedCountry(null);
        setCurrencySearch("");
        setExchangeRate(null);
        setAmount("");
        setNote("");
        setError("");
        setTxSignature("");
        setLoading(false);
      }, 300);
    }
  }, [open]);

  const amountNum = parseFloat(amount) || 0;

  // USDC cost: local amount / rate (rate = local fiat per 1 USD/USDC)
  const usdcCost = (() => {
    if (!selectedCountry || !exchangeRate || amountNum <= 0) return 0;
    if (selectedCountry.currency === "USD") return amountNum;
    return amountNum / exchangeRate;
  })();

  const canSend = amountNum > 0 && usdcCost <= walletBalance && usdcCost > 0 && !!selectedUser && !!selectedCountry;

  const formatUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const handleSend = async () => {
    if (!selectedUser || !embeddedWallet || !canSend) return;
    setLoading(true);
    setError("");
    setStep("processing");
    try {
      const result = await transferUSDC(
        selectedUser.wallet_address,
        usdcCost.toFixed(6),
        embeddedWallet,
        getAuthToken,
        signTransaction
      );
      setTxSignature(result.signature);
      setStep("success");
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Transfer failed. Please try again.");
      setStep("review");
    } finally {
      setLoading(false);
    }
  };

  // ── Recipient pill (reused across steps) ──────────────────────────────────

  const RecipientPill = () => selectedUser ? (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
      <Avatar name={selectedUser.name} avatarUrl={selectedUser.avatar_url} verified={selectedUser.is_verified} size={48} />
      <div>
        <p className="text-base font-semibold text-black">{selectedUser.name}</p>
        {selectedUser.paytag && (
          <p className="text-sm text-gray-800">@{selectedUser.paytag.replace(/^@/, "")}</p>
        )}
      </div>
    </div>
  ) : null;

  // ── Step: Search ──────────────────────────────────────────────────────────

  const renderSearch = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-black">Send to PayBridge user</DialogTitle>
      </DialogHeader>
      <p className="text-base text-gray-800 mt-1 mb-4">Search by name or PayTag</p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
        <Input
          autoFocus
          placeholder="Search name or PayTag..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-9 text-black"
        />
      </div>

      <div className="mt-3 space-y-1 max-h-72 overflow-y-auto">
        {searching && (
          <div className="flex items-center justify-center py-8 text-gray-700">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-base">Searching...</span>
          </div>
        )}
        {!searching && query.trim().length >= 2 && results.length === 0 && (
          <div className="py-8 text-center text-base text-gray-700">No users found</div>
        )}
        {!searching && results.map((u, i) => (
          <button
            key={i}
            onClick={() => { setSelectedUser(u); setStep("currency"); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <Avatar name={u.name} avatarUrl={u.avatar_url} verified={u.is_verified} size={52} />
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-black truncate">{u.name}</p>
              {u.paytag && <p className="text-sm text-gray-800">@{u.paytag.replace(/^@/, "")}</p>}
            </div>
          </button>
        ))}
      </div>
    </>
  );

  // ── Step: Currency ────────────────────────────────────────────────────────

  const renderCurrency = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <button onClick={() => setStep("search")} className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <DialogTitle className="text-2xl font-bold text-black">Choose currency</DialogTitle>
        </div>
      </DialogHeader>

      <div className="mt-4 mb-3">
        <RecipientPill />
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
        <Input
          autoFocus
          placeholder="Search currency or country..."
          value={currencySearch}
          onChange={e => setCurrencySearch(e.target.value)}
          className="pl-9 text-black"
        />
      </div>

      <div className="space-y-1 max-h-72 overflow-y-auto">
        {filteredCurrencies.length === 0 ? (
          <p className="text-base text-gray-700 text-center py-8">No currencies found</p>
        ) : filteredCurrencies.map(c => (
          <button
            key={`${c.code}-${c.currency}`}
            onClick={() => {
              setSelectedCountry(c);
              setCurrencySearch("");
              setAmount("");
              setError("");
              setStep("amount");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <CircleFlag countryCode={c.countryCode} height={36} width={36} />
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-black">{c.name}</p>
              <p className="text-sm text-gray-800">{c.currency}</p>
            </div>
            <span className="text-base font-semibold text-gray-700">{c.currencySymbol}</span>
          </button>
        ))}
      </div>
    </>
  );

  // ── Step: Amount ──────────────────────────────────────────────────────────

  const renderAmount = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <button onClick={() => setStep("currency")} className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <DialogTitle className="text-2xl font-bold text-black">Enter amount</DialogTitle>
        </div>
      </DialogHeader>

      <div className="mt-4 space-y-3">
        <RecipientPill />

        {/* Selected currency pill */}
        {selectedCountry && (
          <button
            onClick={() => setStep("currency")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-left"
          >
            <CircleFlag countryCode={selectedCountry.countryCode} height={28} width={28} />
            <div className="flex-1">
              <p className="text-base font-medium text-black">{selectedCountry.currency} · {selectedCountry.name}</p>
            </div>
            <span className="text-sm text-gray-700">Change ›</span>
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
            Amount ({selectedCountry?.currency})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-medium">
              {selectedCountry?.currencySymbol}
            </span>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="pl-8 text-black text-xl font-semibold"
              disabled={loadingRate}
            />
          </div>
          {loadingRate && (
            <p className="text-sm text-gray-700 mt-1.5 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading rate...
            </p>
          )}
          {!loadingRate && exchangeRate && amountNum > 0 && (
            <p className="text-sm text-gray-800 mt-1.5">
              ≈ {formatUSD(usdcCost)} USDC deducted from your balance
            </p>
          )}
          {!loadingRate && usdcCost > walletBalance && amountNum > 0 && (
            <p className="text-sm text-red-500 mt-1">Insufficient balance</p>
          )}
          <p className="text-sm text-gray-700 mt-1">
            Available: {formatUSD(walletBalance)} USDC
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
            Note (optional)
          </label>
          <Input
            placeholder="What's this for?"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="text-black"
          />
        </div>
      </div>

      {error && <div className="mt-3 p-3 rounded-xl bg-red-50 text-sm text-red-700">{error}</div>}

      <button
        onClick={() => { setError(""); setStep("review"); }}
        disabled={!canSend || loadingRate}
        className="w-full mt-6 py-3.5 rounded-full text-base font-bold transition-opacity disabled:opacity-40"
        style={{ backgroundColor: "#163300", color: "#9FE870" }}
      >
        Continue
      </button>
    </>
  );

  // ── Step: Review ──────────────────────────────────────────────────────────

  const renderReview = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <button onClick={() => setStep("amount")} className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <DialogTitle className="text-2xl font-bold text-black">Confirm transfer</DialogTitle>
        </div>
      </DialogHeader>

      <div className="mt-5 space-y-3">
        <RecipientPill />

        <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-base text-gray-800">Currency</span>
            <div className="flex items-center gap-2">
              {selectedCountry && <CircleFlag countryCode={selectedCountry.countryCode} height={20} width={20} />}
              <span className="text-base font-semibold text-black">{selectedCountry?.currency}</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-base text-gray-800">Amount</span>
            <span className="text-base font-bold text-black">
              {selectedCountry?.currencySymbol}{amountNum.toLocaleString()} {selectedCountry?.currency}
            </span>
          </div>
          {selectedCountry?.currency !== "USD" && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-base text-gray-800">Exchange rate</span>
              <span className="text-base text-black">
                {exchangeRate ? `${selectedCountry?.currencySymbol}${exchangeRate.toFixed(4)} = $1` : "—"}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-base text-gray-800">Network fee</span>
            <span className="text-base text-black">Sponsored (free)</span>
          </div>
          {note && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-base text-gray-800">Note</span>
              <span className="text-base text-black">{note}</span>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <span className="text-base font-semibold text-black">USDC deducted</span>
            <span className="text-base font-bold text-black">{formatUSD(usdcCost)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 text-center px-2">
          This transfer is on-chain and cannot be reversed once confirmed.
        </p>
      </div>

      {error && <div className="mt-3 p-3 rounded-xl bg-red-50 text-base text-red-700">{error}</div>}

      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full mt-5 py-3.5 rounded-full text-base font-bold transition-opacity disabled:opacity-60"
        style={{ backgroundColor: "#163300", color: "#9FE870" }}
      >
        Confirm &amp; Send
      </button>
    </>
  );

  // ── Step: Processing ──────────────────────────────────────────────────────

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader2 className="w-12 h-12 animate-spin" style={{ color: "#163300" }} />
      <p className="text-xl font-semibold text-black">Sending...</p>
      <p className="text-base text-gray-800 text-center max-w-xs">
        Please wait while your transaction is confirmed.
      </p>
    </div>
  );

  // ── Step: Success ─────────────────────────────────────────────────────────

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#9FE870" }}>
        <Check className="w-8 h-8" style={{ color: "#163300" }} />
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-black">Sent!</p>
        <p className="text-gray-800 mt-1 text-base">
          {selectedCountry?.currencySymbol}{amountNum.toLocaleString()} {selectedCountry?.currency} sent to {selectedUser?.name}
        </p>
      </div>
      {txSignature && (
        <a
          href={`https://solscan.io/tx/${txSignature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base underline text-gray-700 hover:text-gray-800"
        >
          View on Solscan
        </a>
      )}
      <button
        onClick={() => onOpenChange(false)}
        className="mt-4 px-8 py-3 rounded-full text-base font-bold"
        style={{ backgroundColor: "#163300", color: "#9FE870" }}
      >
        Done
      </button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        {step === "search" && renderSearch()}
        {step === "currency" && renderCurrency()}
        {step === "amount" && renderAmount()}
        {step === "review" && renderReview()}
        {step === "processing" && renderProcessing()}
        {step === "success" && renderSuccess()}
      </DialogContent>
    </Dialog>
  );
}
