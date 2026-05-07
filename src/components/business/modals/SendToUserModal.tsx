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
import { ArrowLeft, Search, Check, BadgeCheck, Loader2 } from "lucide-react";
import { transferUSDC } from "@/lib/solana/transferUSDC";

// ── Types ────────────────────────────────────────────────────────────────────

type Step = "search" | "amount" | "review" | "processing" | "success";

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

// ── Component ────────────────────────────────────────────────────────────────

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
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txSignature, setTxSignature] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const embeddedWallet = wallets.find(w => w.standardWallet?.name === "Privy");
  const walletAddress = embeddedWallet?.address ?? "";

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

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, walletAddress, getAuthToken]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("search");
        setQuery("");
        setResults([]);
        setSelectedUser(null);
        setAmount("");
        setNote("");
        setError("");
        setTxSignature("");
        setLoading(false);
      }, 300);
    }
  }, [open]);

  const amountNum = parseFloat(amount) || 0;
  const canSend = amountNum > 0 && amountNum <= walletBalance && !!selectedUser;

  const handleSend = async () => {
    if (!selectedUser || !embeddedWallet || !canSend) return;
    setLoading(true);
    setError("");
    setStep("processing");

    try {
      const result = await transferUSDC(
        selectedUser.wallet_address,
        amount,
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

  const formatUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // ── Step: Search ────────────────────────────────────────────────────────────
  const renderSearch = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-black">Send to PayBridge user</DialogTitle>
      </DialogHeader>
      <p className="text-base text-gray-500 mt-1 mb-4">Search by name or PayTag</p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-base">Searching...</span>
          </div>
        )}

        {!searching && query.trim().length >= 2 && results.length === 0 && (
          <div className="py-8 text-center text-base text-gray-400">No users found</div>
        )}

        {!searching && results.map((u, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedUser(u);
              setStep("amount");
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold shrink-0 overflow-hidden"
              style={{ backgroundColor: "#163300" }}
            >
              {u.avatar_url ? (
                <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(u.name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-semibold text-black truncate">{u.name}</span>
                {u.is_verified && (
                  <BadgeCheck className="w-4 h-4 shrink-0" style={{ color: "#163300" }} />
                )}
              </div>
              {u.paytag && (
                <span className="text-base text-gray-500">@{u.paytag}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  );

  // ── Step: Amount ────────────────────────────────────────────────────────────
  const renderAmount = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <button onClick={() => setStep("search")} className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <DialogTitle className="text-2xl font-bold text-black">Enter amount</DialogTitle>
        </div>
      </DialogHeader>

      {selectedUser && (
        <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-gray-50">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold shrink-0 overflow-hidden"
            style={{ backgroundColor: "#163300" }}
          >
            {selectedUser.avatar_url ? (
              <img src={selectedUser.avatar_url} alt={selectedUser.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(selectedUser.name)
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-black">{selectedUser.name}</span>
              {selectedUser.is_verified && (
                <BadgeCheck className="w-4 h-4" style={{ color: "#163300" }} />
              )}
            </div>
            {selectedUser.paytag && (
              <span className="text-base text-gray-500">@{selectedUser.paytag}</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Amount (USDC)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="pl-7 text-black text-xl font-semibold"
            />
          </div>
          <p className="text-base text-gray-400 mt-1.5">
            Available balance: {formatUSD(walletBalance)}
          </p>
          {amountNum > walletBalance && (
            <p className="text-base text-red-500 mt-1">Amount exceeds your balance</p>
          )}
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">
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

      <button
        onClick={() => { setError(""); setStep("review"); }}
        disabled={!canSend}
        className="w-full mt-6 py-3.5 rounded-full text-base font-bold transition-opacity disabled:opacity-40"
        style={{ backgroundColor: "#163300", color: "#9FE870" }}
      >
        Continue
      </button>
    </>
  );

  // ── Step: Review ────────────────────────────────────────────────────────────
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
        <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-base text-gray-500">Sending to</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-black">{selectedUser?.name}</span>
              {selectedUser?.is_verified && (
                <BadgeCheck className="w-4 h-4" style={{ color: "#163300" }} />
              )}
            </div>
          </div>
          {selectedUser?.paytag && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-base text-gray-500">PayTag</span>
              <span className="text-base text-black">@{selectedUser.paytag}</span>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-base text-gray-500">Amount</span>
            <span className="text-base font-bold text-black">{formatUSD(amountNum)} USDC</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-base text-gray-500">Network fee</span>
            <span className="text-base text-black">Sponsored (free)</span>
          </div>
          {note && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-base text-gray-500">Note</span>
              <span className="text-base text-black">{note}</span>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <span className="text-base font-semibold text-black">Total deducted</span>
            <span className="text-base font-bold text-black">{formatUSD(amountNum)} USDC</span>
          </div>
        </div>

        <p className="text-base text-gray-400 text-center px-2">
          This transfer is on-chain (Solana) and cannot be reversed once confirmed.
        </p>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-red-50 text-base text-red-700">{error}</div>
      )}

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

  // ── Step: Processing ────────────────────────────────────────────────────────
  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader2 className="w-12 h-12 animate-spin" style={{ color: "#163300" }} />
      <p className="text-xl font-semibold text-black">Sending...</p>
      <p className="text-base text-gray-500 text-center max-w-xs">
        Please wait while your transaction is confirmed on-chain.
      </p>
    </div>
  );

  // ── Step: Success ────────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#9FE870" }}
      >
        <Check className="w-8 h-8" style={{ color: "#163300" }} />
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-black">Sent!</p>
        <p className="text-gray-500 mt-1 text-base">
          {formatUSD(amountNum)} USDC sent to {selectedUser?.name}
        </p>
      </div>
      {txSignature && (
        <a
          href={`https://solscan.io/tx/${txSignature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base underline text-gray-400 hover:text-gray-600"
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
        {step === "amount" && renderAmount()}
        {step === "review" && renderReview()}
        {step === "processing" && renderProcessing()}
        {step === "success" && renderSuccess()}
      </DialogContent>
    </Dialog>
  );
}
