"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/assets/light-logo";
import { ArrowUpRight, Check, Zap, ShoppingBag, TrendingUp, Menu, X } from "lucide-react";

// ─── Trust stats (edit here) ───────────────────────────────────────────────
const TRUST_STATS = [
  { value: "$120K+", label: "moved by early users" },
  { value: "140+", label: "countries supported" },
  { value: "0 fees", label: "on cashback payouts" },
];

// ─── Live feed transactions ─────────────────────────────────────────────────
const FEED_ITEMS = [
  { merchant: "Corner Coffee", amount: 4.80, cashback: 0.24, emoji: "☕" },
  { merchant: "Metro Grocery", amount: 31.50, cashback: 1.58, emoji: "🛒" },
  { merchant: "City Pharmacy", amount: 12.00, cashback: 0.60, emoji: "💊" },
  { merchant: "Petal Florist", amount: 22.00, cashback: 1.10, emoji: "🌸" },
  { merchant: "Fuel & Go", amount: 55.00, cashback: 2.75, emoji: "⛽" },
  { merchant: "Bright Bakery", amount: 8.50, cashback: 0.43, emoji: "🥐" },
  { merchant: "FreshMart", amount: 47.20, cashback: 2.36, emoji: "🥦" },
  { merchant: "Quick Eats", amount: 14.90, cashback: 0.75, emoji: "🍔" },
];

const EARN_RATE_PER_MS = 0.00018;

// ─── Balance card ───────────────────────────────────────────────────────────
function BalanceCard() {
  const START_BALANCE = 5284.32;
  const startTimeRef = useRef(Date.now());
  const [balance, setBalance] = useState(START_BALANCE);
  const [earnedToday, setEarnedToday] = useState(3.14);
  const now = new Date();
  const ts = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const [feed, setFeed] = useState<
    { id: number; merchant: string; amount: number; cashback: number; emoji: string; ts: string }[]
  >([
    { id: 1, ...FEED_ITEMS[0], ts },
    { id: 2, ...FEED_ITEMS[1], ts },
    { id: 3, ...FEED_ITEMS[2], ts },
  ]);
  const feedItemRef = useRef(3);
  const feedCounterRef = useRef(3);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const gained = elapsed * EARN_RATE_PER_MS;
      setBalance(START_BALANCE + gained);
      setEarnedToday(3.14 + gained);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const item = FEED_ITEMS[feedItemRef.current % FEED_ITEMS.length];
      feedItemRef.current += 1;
      feedCounterRef.current += 1;
      const now = new Date();
      const ts = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setFeed((prev) => [
        { id: feedCounterRef.current, merchant: item.merchant, amount: item.amount, cashback: item.cashback, emoji: item.emoji, ts },
        ...prev.slice(0, 4),
      ]);
      setBalance((b) => b + item.cashback);
      setEarnedToday((e) => e + item.cashback);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      {/* Subtle lime glow behind card */}
      <div className="absolute -inset-4 rounded-3xl opacity-30 blur-3xl" style={{ background: "radial-gradient(ellipse at center, #9FE870 0%, transparent 70%)" }} />

      <div className="relative rounded-3xl overflow-hidden border border-black/8 bg-white shadow-xl shadow-black/10">
        {/* Card header */}
        <div className="px-6 pt-6 pb-4 border-b border-black/5">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#163300" }}>
            Total balance
          </p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-black tabular-nums tracking-tight" style={{ lineHeight: 1.1 }}>
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Earned today pill */}
          <div
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ backgroundColor: "#9FE870", color: "#163300" }}
          >
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs font-bold tabular-nums">
              +${earnedToday.toFixed(2)} earned today
            </span>
          </div>
        </div>

        {/* Live purchase feed */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#163300" }}>
            Recent purchases
          </p>
          <div className="space-y-2 min-h-[140px]">
            {feed.length === 0 && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-1 animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-black/5" />
                      <div className="h-3 w-24 bg-black/5 rounded" />
                    </div>
                    <div className="h-3 w-14 bg-black/5 rounded" />
                  </div>
                ))}
              </div>
            )}
            {feed.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-1 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-sm">
                    {item.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black leading-none">{item.merchant}</p>
                    <p className="text-xs text-gray-400 mt-0.5">${item.amount.toFixed(2)} spent · {item.ts}</p>
                  </div>
                </div>
                <span className="text-xs font-bold" style={{ color: "#163300" }}>
                  +${item.cashback.toFixed(2)} back
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card footer */}
        <div className="px-6 py-3 border-t border-black/5 flex items-center justify-end">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#9FE870" }} />
            Live
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Waitlist form ──────────────────────────────────────────────────────────
type FormState = "idle" | "loading" | "success" | "error";

function WaitlistForm({ referredBy }: { referredBy: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErrorMsg("Enter your name."); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorMsg("Enter a valid email address."); return; }
    if (!phone.trim()) { setErrorMsg("Enter your phone number."); return; }
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email, phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Try again.");
        setState("error");
        return;
      }
      setSuccess(true);
      setState("success");
    } catch {
      setErrorMsg("Network error. Try again.");
      setState("error");
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#9FE870" }}
          >
            <Check className="h-5 w-5" style={{ color: "#163300" }} />
          </div>
          <p className="font-black text-black text-lg mb-1">You&apos;re on the list.</p>
          <p className="text-sm" style={{ color: "#163300" }}>
            We&apos;ll be in touch when early access opens. Stay tuned.
          </p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => { setName(e.target.value); setErrorMsg(""); }}
        placeholder="Full name"
        className={inputClass}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
        placeholder="Email address"
        className={inputClass}
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => { setPhone(e.target.value); setErrorMsg(""); }}
        placeholder="Phone number"
        className={inputClass}
      />
      {errorMsg && (
        <p className="text-xs text-red-500 pl-2">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        style={{ backgroundColor: "#9FE870", color: "#163300" }}
      >
        {state === "loading" ? (
          <span className="w-4 h-4 border-2 border-[#163300]/30 border-t-[#163300] rounded-full animate-spin" />
        ) : (
          <>
            Join waitlist
            <ArrowUpRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

// ─── Feature blocks ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: TrendingUp,
    title: "Your balance earns",
    body: "Every dollar in your PayBridge account earns continuously. No lock-ups, no minimums, no waiting.",
  },
  {
    icon: ShoppingBag,
    title: "Pay at any point of sale",
    body: "Tap to pay anywhere cards are accepted. In-store, online, or in-app. Your PayBridge app works everywhere.",
  },
  {
    icon: Zap,
    title: "Instant cashback",
    body: "Every purchase comes back to you. Cashback lands in your account the moment the transaction clears.",
  },
];

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute top-0 left-0 right-0 z-50 px-6 md:px-8 lg:px-14">
      <header className="max-w-7xl mx-auto py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo />
          <span className="text-[22px] font-extrabold" style={{ color: "#163300" }}>PayBridge</span>
        </a>
        <div className="flex items-center gap-4">
          <a
            href="#join"
            className="hidden md:inline-flex px-4 py-2 rounded-full text-base font-medium transition-colors hover:bg-[#9FE870]/30"
            style={{ color: "#163300" }}
          >
            Join waitlist
          </a>
          <Link
            href="/"
            className="hidden md:inline-flex px-5 py-2.5 rounded-full text-base font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: "#9FE870", color: "#163300" }}
          >
            Back to site
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
          >
            {open ? <X className="w-6 h-6" style={{ color: "#163300" }} /> : <Menu className="w-6 h-6" style={{ color: "#163300" }} />}
          </button>
        </div>
      </header>
      {open && (
        <div className="md:hidden px-4 py-4 border-t border-black/5 flex flex-col gap-1 bg-white">
          <a href="#join" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg" style={{ color: "#163300" }}>
            Join waitlist
          </a>
          <Link href="/" onClick={() => setOpen(false)} className="mt-2 px-4 py-3 rounded-full text-sm font-bold text-center" style={{ backgroundColor: "#9FE870", color: "#163300" }}>
            Back to site
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function EarnPage() {
  const [referredBy, setReferredBy] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("r");
    if (r) setReferredBy(r);
  }, []);

  return (
    <div className="flex flex-col text-foreground" style={{ backgroundColor: "#faf9f9", fontFamily: "Poppins, sans-serif" }}>

      {/* Hero */}
      <section className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: "#faf9f9" }}>
        <Nav />

        <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center px-6 md:px-16 lg:px-24 pt-24 sm:pt-32 md:pt-40 pb-16 max-w-7xl mx-auto">
          {/* Balance card — second on mobile, right column on desktop */}
          <div className="order-last lg:order-last flex justify-center lg:justify-end">
            <BalanceCard />
          </div>

          {/* Copy + form — first on mobile, left column on desktop */}
          <div id="join" className="order-first lg:order-first text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
              style={{ backgroundColor: "#9FE870", color: "#163300" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#163300] animate-pulse" />
              Early access open
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black mb-5" style={{ lineHeight: 0.99 }}>
              Your money<br />
              shouldn&apos;t<br />
              sit still.
            </h1>

            <p className="text-sm md:text-lg font-normal mb-8 max-w-md leading-relaxed mx-auto lg:mx-0" style={{ color: "#163300" }}>
              Earn on your balance, pay at any point of sale, and get instant cashback on every purchase.
            </p>

            <div className="flex justify-center lg:justify-start">
              <WaitlistForm referredBy={referredBy} />
            </div>
            <p className="text-xs text-gray-400 mt-3 pl-2">Early access spots are limited.</p>
          </div>
        </div>
      </section>

      {/* Feature blocks */}
      <section className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "#9FE870" }}
              >
                <Icon className="h-5 w-5" style={{ color: "#163300" }} />
              </div>
              <h3 className="font-black text-black text-lg mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#163300" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Bottom CTA */}
      <section className="px-6 md:px-16 lg:px-24 py-24 border-t border-black/5">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-black mb-4" style={{ lineHeight: 0.99 }}>
            Be first in line.
          </h2>
          <p className="text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: "#163300" }}>
            Join thousands who are already waiting. Share your link to move up.
          </p>
          <div className="flex justify-center">
            <WaitlistForm referredBy={referredBy} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 px-6 md:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Logo />
                <span className="text-2xl font-bold">PayBridge</span>
              </div>
              <p className="text-white/60 text-sm">Bridge money. Anywhere. Instantly.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">Personal</Link></li>
                <li><Link href="/business" className="text-white/60 hover:text-white text-sm transition-colors">Business</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/support" className="text-white/60 hover:text-white text-sm transition-colors">Support</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} PayBridge Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
