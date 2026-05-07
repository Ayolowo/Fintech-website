"use client";

import { useState, useEffect, useCallback } from "react";
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
import { ArrowLeft, Plus, Check, Search, Info } from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import { transferUSDC } from "@/lib/solana/transferUSDC";
import {
  PaymentCountry,
  getWithdrawCountries,
  isMomoCurrency,
  getMethodLabel,
  COUNTRY_PHONE_PREFIXES,
} from "@/data/paymentCountries";

// ── Types ────────────────────────────────────────────────────────────────────

type Step =
  | "country"
  | "transfer_type"      // Bridge: ACH vs wire
  | "yc_recipient"       // YellowCard: bank or momo recipient details
  | "select_account"     // Bridge: saved accounts
  | "recipient"          // Bridge: new US bank account
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
  account?: { account_number: string; routing_number: string };
  address?: AddressDetails;
}

interface YCRecipient {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  phoneNumber?: string; // for momo
  networkId?: string;   // for momo
}

interface SendMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
  onSuccess?: () => void;
}

const ACH_FEE = 10;
const WIRE_FEE = 15;
const YC_PERCENTAGE_FEE = 0.007;

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function SendMoneyModal({ open, onOpenChange, walletBalance, onSuccess }: SendMoneyModalProps) {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { signTransaction } = useSignTransaction();
  const { getAuthToken } = useAuth();

  // Country selection
  const [selectedCountry, setSelectedCountry] = useState<PaymentCountry | null>(null);
  const [countrySearch, setCountrySearch] = useState("");

  // Shared
  const [step, setStep] = useState<Step>("country");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  // Bridge state
  const [transferType, setTransferType] = useState<TransferType>("ach");
  const [externalAccounts, setExternalAccounts] = useState<BridgeExternalAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BridgeExternalAccount | null>(null);
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);
  const [wireMessage, setWireMessage] = useState("");
  const [bankDetails, setBankDetails] = useState<BankAccountDetails>({
    fullName: "", accountNumber: "", routingNumber: "", accountType: "checking", bankName: "",
  });
  const [address, setAddress] = useState<AddressDetails>({
    street: "", city: "", state: "", postalCode: "", country: "US",
  });

  // YellowCard state
  const [ycRecipient, setYcRecipient] = useState<YCRecipient>({
    accountName: "", accountNumber: "", bankCode: "", bankName: "", phoneNumber: "", networkId: "",
  });
  const [ycBanks, setYcBanks] = useState<Array<{ id: string; name: string; code?: string }>>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  const userEmail = user?.email?.address ?? "";
  const embeddedWallet = wallets.find(w => w.standardWallet?.name === "Privy");
  const walletAddress = embeddedWallet?.address ?? "";

  const withdrawCountries = getWithdrawCountries();
  const filteredCountries = withdrawCountries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.currency.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Load exchange rate for YellowCard countries
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
        // sell rate = how many local currency units per 1 USD (user sends USD, recipient gets local)
        setExchangeRate(rate.sell * (1 - YC_PERCENTAGE_FEE));
      } else if (selectedCountry.provider === 'bridge') {
        if (selectedCountry.currency === 'USD') {
          setExchangeRate(1.0);
        } else {
          const res = await fetch(`/api/public/bridge/exchange-rates?currency=${selectedCountry.currency.toLowerCase()}&direction=usd_to_fiat`);
          if (!res.ok) throw new Error("Failed to load rate");
          const data = await res.json();
          // buy_rate = fiat per 1 USD (user sends USDC, recipient gets fiat)
          const rate = data.buy_rate || data.midmarket_rate || data.sell_rate;
          if (!rate) throw new Error("Rate not found");
          setExchangeRate(rate);
        }
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

  // Load YellowCard banks when entering yc_recipient step (bank flow)
  useEffect(() => {
    if (!open || step !== "yc_recipient" || !selectedCountry) return;
    if (selectedCountry.provider !== 'yellowcard') return;
    if (isMomoCurrency(selectedCountry.currency)) return; // momo doesn't need bank list

    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const token = await getAuthToken();
        const res = await fetch(`/api/business/channels?country=${selectedCountry.code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        // Extract bank list from payment channels
        const banks: Array<{ id: string; name: string; code?: string }> = [];
        data.forEach((ch: any) => {
          if (ch.networks) {
            ch.networks.forEach((net: any) => {
              if (!banks.find(b => b.id === net.id)) {
                banks.push({ id: net.id, name: net.name, code: net.code });
              }
            });
          }
        });
        setYcBanks(banks);
      } catch {}
      finally { setLoadingBanks(false); }
    };
    fetchBanks();
  }, [open, step, selectedCountry, getAuthToken]);

  // Load Bridge external accounts
  useEffect(() => {
    if (!open || step !== "select_account" || !userEmail) return;
    const load = async () => {
      setLoadingAccounts(true);
      try {
        const token = await getAuthToken();
        const res = await fetch(`/api/bridge/external-accounts/list?email=${userEmail}&currency=usd`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setExternalAccounts(data.data || []);
        }
      } catch {} finally { setLoadingAccounts(false); }
    };
    load();
  }, [open, step, userEmail, getAuthToken]);

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
        setSelectedAccount(null);
        setSavingAccount(false);
        setAccountSaved(false);
        setWireMessage("");
        setBankDetails({ fullName: "", accountNumber: "", routingNumber: "", accountType: "checking", bankName: "" });
        setAddress({ street: "", city: "", state: "", postalCode: "", country: "US" });
        setYcRecipient({ accountName: "", accountNumber: "", bankCode: "", bankName: "", phoneNumber: "", networkId: "" });
        setYcBanks([]);
      }, 300);
    }
  }, [open]);

  const currentFee = transferType === "wire" ? WIRE_FEE : ACH_FEE;

  const handleBack = () => {
    if (step === "country") { onOpenChange(false); return; }
    if (step === "transfer_type" || step === "yc_recipient") { setStep("country"); setError(""); return; }
    if (step === "select_account") { setStep("transfer_type"); return; }
    if (step === "recipient") { setStep("select_account"); return; }
    if (step === "amount") {
      if (selectedCountry?.provider === 'yellowcard') setStep("yc_recipient");
      else if (selectedAccount) setStep("select_account");
      else setStep("recipient");
      return;
    }
    if (step === "review") { setStep("amount"); return; }
  };

  // ── Bridge: save new account ─────────────────────────────────────────────
  const handleSaveBridgeAccount = async () => {
    setSavingAccount(true);
    setError("");
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/bridge/external-accounts/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail, currency: "usd", bank_name: bankDetails.bankName,
          account_owner_name: bankDetails.fullName, account_type: "us",
          account: { account_number: bankDetails.accountNumber, routing_number: bankDetails.routingNumber, checking_or_savings: bankDetails.accountType },
          address: { street_line_1: address.street, city: address.city, state: address.state, postal_code: address.postalCode, country: address.country },
        }),
      });
      if (!res.ok) throw new Error("Failed to save account");
      const data = await res.json();
      setSelectedAccount({
        id: data.id, customer_id: data.customer_id, currency: data.currency,
        account_owner_name: bankDetails.fullName, bank_name: bankDetails.bankName,
        account: { account_number: bankDetails.accountNumber, routing_number: bankDetails.routingNumber },
        address: { street: address.street, city: address.city, state: address.state, postalCode: address.postalCode, country: address.country },
      });
      setAccountSaved(true);
      setTimeout(() => { setAccountSaved(false); setSavingAccount(false); setStep("amount"); }, 1500);
    } catch {
      setError("Failed to save account. Please try again.");
      setSavingAccount(false);
    }
  };

  const handleAmountSubmit = () => {
    const fiatAmount = parseFloat(amount);
    if (!amount || fiatAmount <= 0) { setError("Please enter an amount"); return; }
    if (selectedCountry?.provider === 'bridge') {
      if (fiatAmount < 1) { setError("Minimum amount is $1.00"); return; }
      if (fiatAmount + currentFee > walletBalance) { setError("Insufficient balance to cover amount and fee"); return; }
    }
    if (selectedCountry?.provider === 'yellowcard') {
      if (!exchangeRate) { setError("Exchange rate not loaded"); return; }
    }
    setError("");
    setStep("review");
  };

  const handleSubmit = async () => {
    if (!selectedCountry) return;
    setLoading(true);
    setStep("processing");
    setError("");

    try {
      const token = await getAuthToken();
      const fiatAmount = parseFloat(amount);

      if (selectedCountry.provider === 'yellowcard') {
        // YellowCard send/payout
        const isMomo = isMomoCurrency(selectedCountry.currency);
        const payload = {
          country: selectedCountry.code,
          currency: selectedCountry.currency,
          amount: fiatAmount,
          userEmail,
          walletAddress,
          recipient: isMomo ? {
            type: "momo",
            phoneNumber: ycRecipient.phoneNumber
              ? (ycRecipient.phoneNumber.startsWith("+")
                  ? ycRecipient.phoneNumber
                  : `${COUNTRY_PHONE_PREFIXES[selectedCountry.code] || ""}${ycRecipient.phoneNumber.replace(/^0+/, "")}`)
              : "",
            networkId: ycRecipient.networkId,
            accountName: ycRecipient.accountName,
          } : {
            type: "bank",
            accountName: ycRecipient.accountName,
            accountNumber: ycRecipient.accountNumber,
            bankCode: ycRecipient.bankCode,
          },
          exchangeRate,
        };
        const res = await fetch(`/api/business/send`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Transfer failed");
        }

      } else if (selectedCountry.provider === 'bridge') {
        if (!embeddedWallet) throw new Error("Missing wallet information");

        const externalAccountId = selectedAccount!.id;
        const totalCost = fiatAmount + currentFee;

        if (transferType === "wire") {
          const feeWalletRes = await fetch(`/api/bridge/fee-wallet`, { headers: { Authorization: `Bearer ${token}` } });
          if (!feeWalletRes.ok) throw new Error("Transfer failed. Please try again.");
          const { fee_wallet: feeWalletAddress } = await feeWalletRes.json();

          const liqRes = await fetch(`/api/bridge/liquidation-address/create`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail, wallet_address: walletAddress, external_account_id: externalAccountId, destination_wire_message: wireMessage.trim() }),
          });
          if (!liqRes.ok) throw new Error("Transfer failed. Please try again.");
          const liqData = await liqRes.json();

          const txSig = await transferUSDC(liqData.address, fiatAmount.toFixed(2), embeddedWallet, getAuthToken,
            async (params) => signTransaction({ ...params, options: { uiOptions: { showWalletUIs: false } } })
          );
          await transferUSDC(feeWalletAddress, WIRE_FEE.toFixed(2), embeddedWallet, getAuthToken,
            async (params) => signTransaction({ ...params, options: { uiOptions: { showWalletUIs: false } } })
          );

          await fetch(`/api/business/transactions`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              wallet_address: walletAddress, recipient_name: selectedAccount!.account_owner_name,
              recipient_bank_name: selectedAccount?.bank_name || bankDetails.bankName,
              recipient_account_number: selectedAccount?.account?.account_number || bankDetails.accountNumber,
              recipient_routing_number: selectedAccount?.account?.routing_number || bankDetails.routingNumber,
              recipient_address_street: address.street, recipient_address_city: address.city,
              recipient_address_state: address.state, recipient_address_postal_code: address.postalCode,
              recipient_address_country: address.country || "US",
              amount_usdc: fiatAmount + WIRE_FEE, amount_fiat: fiatAmount, fiat_currency: "USD",
              exchange_rate: 1.0, payment_method: "wire",
              bridge_transaction_id: liqData.id, bridge_deposit_address: liqData.address,
              bridge_deposit_amount: fiatAmount.toFixed(2), transaction_hash: txSig.signature, status: "pending",
            }),
          });

        } else {
          // ACH
          const withdrawalRes = await fetch(`/api/bridge/withdrawal/create`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail, wallet_address: walletAddress, amount_usdc: totalCost.toFixed(2),
              currency: "usd", external_account_id: externalAccountId,
              developer_fee: currentFee.toFixed(2), payment_rail: "ach_same_day",
            }),
          });
          if (!withdrawalRes.ok) throw new Error("Transfer failed. Please try again.");
          const transfer = await withdrawalRes.json();

          const txSig = await transferUSDC(transfer.deposit_address, transfer.deposit_amount.toString(), embeddedWallet, getAuthToken,
            async (params) => signTransaction({ ...params, options: { uiOptions: { showWalletUIs: false } } })
          );

          await fetch(`/api/business/transactions`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              wallet_address: walletAddress, recipient_name: selectedAccount!.account_owner_name,
              recipient_bank_name: selectedAccount?.bank_name || bankDetails.bankName,
              recipient_account_number: selectedAccount?.account?.account_number || bankDetails.accountNumber,
              recipient_routing_number: selectedAccount?.account?.routing_number || bankDetails.routingNumber,
              recipient_address_street: address.street, recipient_address_city: address.city,
              recipient_address_state: address.state, recipient_address_postal_code: address.postalCode,
              recipient_address_country: address.country || "US",
              amount_usdc: totalCost, amount_fiat: fiatAmount, fiat_currency: "USD",
              exchange_rate: 1.0, payment_method: "ach",
              bridge_transaction_id: transfer.transfer_id, bridge_deposit_address: transfer.deposit_address,
              bridge_deposit_amount: transfer.deposit_amount, transaction_hash: txSig.signature, status: "pending",
            }),
          });
        }
      }

      setStep("success");
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Transfer failed. Please try again.");
      setStep("review");
    } finally {
      setLoading(false);
    }
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
          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-base outline-none focus:border-gray-400"
          autoFocus
        />
      </div>
      <div className="space-y-1 max-h-[420px] overflow-y-auto">
        {filteredCountries.length === 0 ? (
          <p className="text-base text-gray-400 text-center py-8">No countries found</p>
        ) : filteredCountries.map(c => (
          <button
            key={`${c.code}-${c.currency}`}
            onClick={() => {
              setSelectedCountry(c);
              setCountrySearch("");
              // Route to appropriate next step
              if (c.provider === 'bridge') setStep("transfer_type");
              else setStep("yc_recipient");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <CircleFlag countryCode={c.countryCode} height="28" width="28" />
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-gray-900">{c.name}</p>
              <p className="text-base text-gray-500">{c.currency} · {getMethodLabel(c.currency)}</p>
            </div>
            <span className="text-base font-semibold text-gray-400">{c.currencySymbol}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTransferType = () => (
    <div className="space-y-4">
      <p className="text-base text-gray-500">Choose how you want to send money to {selectedCountry?.name}</p>
      <button
        onClick={() => { setTransferType("ach"); setStep("select_account"); }}
        className="w-full p-5 bg-white border-2 border-gray-200 hover:border-black rounded-xl text-left transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-black">ACH Bank Transfer</p>
            <p className="text-base text-gray-500 mt-0.5">$10 fee · 1–3 business days</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </button>
      <button
        onClick={() => { setTransferType("wire"); setStep("select_account"); }}
        className="w-full p-5 bg-white border-2 border-gray-200 hover:border-black rounded-xl text-left transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-black">Wire Transfer</p>
            <p className="text-base text-gray-500 mt-0.5">$15 fee · Same day</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </button>
    </div>
  );

  const renderYCRecipient = () => {
    if (!selectedCountry) return null;
    const isMomo = isMomoCurrency(selectedCountry.currency);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl">
          <CircleFlag countryCode={selectedCountry.countryCode} height="24" width="24" />
          <div>
            <p className="text-base font-medium text-gray-900">{selectedCountry.name} · {selectedCountry.currency}</p>
            <p className="text-base text-gray-500">{isMomo ? "Mobile Money" : "Bank Transfer"}</p>
          </div>
        </div>

        {isMomo ? (
          <>
            <div>
              <Label>Account Name</Label>
              <Input placeholder="Recipient full name" value={ycRecipient.accountName}
                onChange={e => setYcRecipient({ ...ycRecipient, accountName: e.target.value })} />
            </div>
            <div>
              <Label>Phone Number</Label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-base bg-gray-50 text-gray-600 whitespace-nowrap">
                  {COUNTRY_PHONE_PREFIXES[selectedCountry.code] || "+?"}
                </span>
                <Input placeholder="7XXXXXXXX" value={ycRecipient.phoneNumber || ""}
                  onChange={e => setYcRecipient({ ...ycRecipient, phoneNumber: e.target.value })} />
              </div>
            </div>
            {ycBanks.length > 0 && (
              <div>
                <Label>Mobile Network</Label>
                <Select value={ycRecipient.networkId} onValueChange={v => {
                  const bank = ycBanks.find(b => b.id === v);
                  setYcRecipient({ ...ycRecipient, networkId: v, bankName: bank?.name || "" });
                }}>
                  <SelectTrigger><SelectValue placeholder="Select network" /></SelectTrigger>
                  <SelectContent>
                    {ycBanks.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <Label>Account Name</Label>
              <Input placeholder="Recipient full name" value={ycRecipient.accountName}
                onChange={e => setYcRecipient({ ...ycRecipient, accountName: e.target.value })} />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input placeholder="Account number" value={ycRecipient.accountNumber}
                onChange={e => setYcRecipient({ ...ycRecipient, accountNumber: e.target.value })} />
            </div>
            {loadingBanks ? (
              <Skeleton className="h-10 w-full" />
            ) : ycBanks.length > 0 ? (
              <div>
                <Label>Bank</Label>
                <Select value={ycRecipient.bankCode} onValueChange={v => {
                  const bank = ycBanks.find(b => b.id === v || b.code === v);
                  setYcRecipient({ ...ycRecipient, bankCode: v, bankName: bank?.name || "" });
                }}>
                  <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                  <SelectContent>
                    {ycBanks.map(b => <SelectItem key={b.id} value={b.code || b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label>Bank Name</Label>
                <Input placeholder="Bank name" value={ycRecipient.bankName}
                  onChange={e => setYcRecipient({ ...ycRecipient, bankName: e.target.value })} />
              </div>
            )}
          </>
        )}

        {error && <p className="text-base text-red-500">{error}</p>}

        <button
          onClick={() => {
            const isMomo = isMomoCurrency(selectedCountry.currency);
            if (!ycRecipient.accountName) { setError("Account name is required"); return; }
            if (isMomo && !ycRecipient.phoneNumber) { setError("Phone number is required"); return; }
            if (!isMomo && !ycRecipient.accountNumber) { setError("Account number is required"); return; }
            setError("");
            setStep("amount");
          }}
          disabled={loadingRate}
          className="w-full py-3 rounded-xl font-semibold text-base disabled:opacity-40"
          style={{ backgroundColor: '#9FE870', color: '#163300' }}
        >
          {loadingRate ? "Loading rate..." : "Continue"}
        </button>
      </div>
    );
  };

  const renderSelectAccount = () => (
    <div className="space-y-4">
      {loadingAccounts ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <>
          {externalAccounts.length > 0 && (
            <div className="space-y-2">
              <p className="text-base font-medium text-gray-500 uppercase tracking-wide">Saved accounts</p>
              {externalAccounts.map(acc => (
                <button key={acc.id} onClick={() => { setSelectedAccount(acc); setStep("amount"); }}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-between text-left transition-colors"
                >
                  <div>
                    <p className="font-medium text-black">{acc.account_owner_name}</p>
                    <p className="text-base text-gray-500">{acc.bank_name} ••••{acc.account?.account_number.slice(-4)}</p>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              ))}
            </div>
          )}
          <button onClick={() => { setSelectedAccount(null); setStep("recipient"); }}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 flex items-center justify-center gap-2 text-gray-600 transition-colors"
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
        <Input id="fullName" placeholder="John Doe" value={bankDetails.fullName}
          onChange={e => setBankDetails({ ...bankDetails, fullName: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input id="bankName" placeholder="Chase Bank" value={bankDetails.bankName}
          onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input id="accountNumber" placeholder="123456789" value={bankDetails.accountNumber}
          onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="routingNumber">Routing Number</Label>
        <Input id="routingNumber" placeholder="021000021" value={bankDetails.routingNumber}
          onChange={e => setBankDetails({ ...bankDetails, routingNumber: e.target.value })} />
      </div>
      <div>
        <Label>Account Type</Label>
        <div className="flex gap-2 mt-2">
          {(["checking", "savings"] as const).map(type => (
            <button key={type} onClick={() => setBankDetails({ ...bankDetails, accountType: type })}
              className={`flex-1 py-2 px-4 rounded-lg border text-base font-medium capitalize ${bankDetails.accountType === type ? "border-transparent" : "bg-gray-50 text-gray-600 border-gray-200"}`}
              style={bankDetails.accountType === type ? { backgroundColor: '#163300', color: '#9FE870' } : {}}
            >{type}</button>
          ))}
        </div>
      </div>
      <div className="pt-3 border-t">
        <p className="text-base font-medium text-gray-500 mb-3 uppercase tracking-wide">Address</p>
        <div className="space-y-3">
          <div><Label>Street Address</Label><Input placeholder="123 Main St" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>City</Label><Input placeholder="New York" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} /></div>
            <div>
              <Label>State</Label>
              <Select value={address.state} onValueChange={v => setAddress({ ...address, state: v })}>
                <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>{US_STATES.map(s => <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Postal Code</Label><Input placeholder="10001" value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} /></div>
        </div>
      </div>
      {error && <p className="text-base text-red-500">{error}</p>}
      {accountSaved ? (
        <div className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-medium text-center flex items-center justify-center gap-2 text-base">
          <Check className="w-4 h-4" /> Account saved!
        </div>
      ) : (
        <button onClick={handleSaveBridgeAccount}
          disabled={savingAccount || !bankDetails.fullName || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.routingNumber || !address.street || !address.city || !address.state || !address.postalCode}
          className="w-full py-3 rounded-xl font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#9FE870', color: '#163300' }}
        >{savingAccount ? "Saving..." : "Continue"}</button>
      )}
    </div>
  );

  const renderAmount = () => {
    const isBridge = selectedCountry?.provider === 'bridge';
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-base text-gray-500 mb-6">
            Available balance: <span className="font-medium">${walletBalance.toFixed(2)}</span>
          </p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-bold">{isBridge ? "$" : selectedCountry?.currencySymbol}</span>
            <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
              className="text-4xl font-bold text-center border-none outline-none bg-transparent w-48"
            />
          </div>
          {isBridge && (
            <p className="text-base text-gray-500">{transferType === "wire" ? "Wire" : "ACH"} fee: ${currentFee}</p>
          )}
          {!isBridge && exchangeRate && amount && (
            <p className="text-base text-gray-500">
              ≈ ${(parseFloat(amount) / exchangeRate).toFixed(2)} USDC deducted from wallet
            </p>
          )}
        </div>
        {error && <p className="text-base text-red-500 text-center">{error}</p>}
        <button onClick={handleAmountSubmit} disabled={!amount || parseFloat(amount) <= 0}
          className="w-full py-3 rounded-xl font-semibold text-base disabled:opacity-40"
          style={{ backgroundColor: '#9FE870', color: '#163300' }}
        >Continue</button>
      </div>
    );
  };

  const renderReview = () => {
    if (!selectedCountry) return null;
    const fiatAmount = parseFloat(amount || "0");
    const isBridge = selectedCountry.provider === 'bridge';
    const totalCost = isBridge ? fiatAmount + currentFee : null;
    const ycUSDC = (!isBridge && exchangeRate) ? fiatAmount / exchangeRate : null;

    const recipientName = isBridge
      ? (selectedAccount?.account_owner_name || bankDetails.fullName)
      : ycRecipient.accountName;
    const bankInfo = isBridge && selectedAccount
      ? `${selectedAccount.bank_name} ••••${selectedAccount.account?.account_number.slice(-4)}`
      : isBridge
      ? `${bankDetails.bankName} ••••${bankDetails.accountNumber.slice(-4)}`
      : (ycRecipient.bankName || ycRecipient.networkId || "");

    return (
      <div className="space-y-5">
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-base text-gray-500 mb-1">Sending to</p>
          <p className="font-semibold text-gray-900">{recipientName}</p>
          {bankInfo && <p className="text-base text-gray-500">{bankInfo}</p>}
          <div className="flex items-center gap-2 mt-2">
            <CircleFlag countryCode={selectedCountry.countryCode} height="16" width="16" />
            <span className="text-base text-gray-600">{selectedCountry.name} · {selectedCountry.currency}</span>
          </div>
        </div>

        <div className="space-y-3 text-base">
          <div className="flex justify-between">
            <span className="text-gray-500">Recipient gets</span>
            <span className="font-medium">{selectedCountry.currencySymbol}{fiatAmount.toLocaleString()} {selectedCountry.currency}</span>
          </div>
          {isBridge && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">{transferType === "wire" ? "Wire" : "ACH"} fee</span>
                <span className="font-medium">${currentFee.toFixed(2)} USDC</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total deducted</span>
                <span className="font-semibold">${totalCost!.toFixed(2)} USDC</span>
              </div>
            </>
          )}
          {ycUSDC !== null && (
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold">USDC deducted</span>
              <span className="font-semibold">${ycUSDC.toFixed(4)} USDC</span>
            </div>
          )}
        </div>

        {isBridge && transferType === "wire" && (
          <div>
            <p className="text-base font-medium text-gray-700 mb-1">Wire message <span className="text-gray-400 font-normal">(optional)</span></p>
            <textarea placeholder="Message for recipient" value={wireMessage}
              onChange={e => { if (e.target.value.length <= 140) setWireMessage(e.target.value); }}
              maxLength={140} rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-base outline-none focus:border-gray-400 resize-none"
            />
            <p className="text-base text-gray-400 text-right mt-1">{wireMessage.length}/140</p>
          </div>
        )}

        {error && <p className="text-base text-red-500 text-center">{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-base disabled:opacity-40"
          style={{ backgroundColor: '#9FE870', color: '#163300' }}
        >{loading ? "Processing..." : "Confirm & Send"}</button>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="py-16 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163300] mx-auto mb-4" />
      <p className="text-gray-500">Processing your transfer...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold mb-2">Transfer Successful!</h3>
      <p className="text-gray-500 mb-6 text-base">Your money has been sent.</p>
      <button onClick={() => onOpenChange(false)} className="w-full py-3 rounded-xl font-semibold text-base" style={{ backgroundColor: '#9FE870', color: '#163300' }}>
        Done
      </button>
    </div>
  );

  const titles: Record<Step, string> = {
    country: "Send Money",
    transfer_type: "Transfer Type",
    yc_recipient: "Recipient Details",
    select_account: "Select Account",
    recipient: "New Account",
    amount: "Enter Amount",
    review: "Review Transfer",
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
          {step === "transfer_type" && renderTransferType()}
          {step === "yc_recipient" && renderYCRecipient()}
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
