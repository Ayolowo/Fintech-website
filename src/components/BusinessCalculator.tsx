"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  ChevronDown,
  Loader2,
  Search,
  Lock,
  Zap,
  Receipt,
  Info,
  ChevronRight,
  Tag,
} from "lucide-react";
import { currencies } from "../data/currencies";
import {
  calculateExchangeRate,
  formatCurrencyAmount,
  formatExchangeRate,
} from "../services/exchangeRateApi";
import { CircleFlag } from "react-circle-flags";

const BusinessCalculator = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromCountry, setFromCountry] = useState("us");
  const [toCountry, setToCountry] = useState("eu");
  const [fromAmount, setFromAmount] = useState("1000");
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);
  const fromSearchRef = useRef<HTMLInputElement>(null);
  const toSearchRef = useRef<HTMLInputElement>(null);

  const filteredFromCurrencies = useMemo(() => {
    if (!fromSearch) return currencies;
    const query = fromSearch.toLowerCase();
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query),
    );
  }, [fromSearch]);

  const filteredToCurrencies = useMemo(() => {
    if (!toSearch) return currencies;
    const query = toSearch.toLowerCase();
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query),
    );
  }, [toSearch]);

  const fetchExchangeRate = useCallback(async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount("");
      setExchangeRate(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amount = parseFloat(fromAmount);
      const result = await calculateExchangeRate(
        fromCurrency,
        toCurrency,
        amount,
      );
      setExchangeRate(result.rate);
      setToAmount(formatCurrencyAmount(result.toAmount, toCurrency));
    } catch (err) {
      setError("Unable to fetch exchange rate. Please try again.");
      setToAmount("");
      setExchangeRate(null);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExchangeRate();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchExchangeRate]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const formatNumberDisplay = (value: string): string => {
    if (!value) return "";
    const num = parseFloat(value);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(e.target as Node)
      ) {
        setShowFromDropdown(false);
        setFromSearch("");
      }
      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(e.target as Node)
      ) {
        setShowToDropdown(false);
        setToSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showFromDropdown && fromSearchRef.current)
      fromSearchRef.current.focus();
  }, [showFromDropdown]);

  useEffect(() => {
    if (showToDropdown && toSearchRef.current) toSearchRef.current.focus();
  }, [showToDropdown]);

  const groupByRegion = (currencyList: typeof currencies) => {
    const groups: Record<string, typeof currencies> = {};
    currencyList.forEach((c) => {
      if (!groups[c.region]) groups[c.region] = [];
      groups[c.region].push(c);
    });
    return groups;
  };

  const renderCurrencyDropdown = (
    filteredList: typeof currencies,
    onSelect: (code: string, countryCode: string) => void,
    searchValue: string,
    onSearchChange: (val: string) => void,
    searchRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const grouped = groupByRegion(filteredList);
    const regionOrder = ["Americas", "Europe", "Africa"];

    return (
      <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2.5 border border-gray-200">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search currency..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-900"
            />
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {filteredList.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              No currencies found
            </div>
          ) : (
            regionOrder.map((region) => {
              const regionCurrencies = grouped[region];
              if (!regionCurrencies || regionCurrencies.length === 0)
                return null;
              return (
                <div key={region}>
                  <div className="px-4 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    {region}
                  </div>
                  {regionCurrencies.map((currency) => (
                    <button
                      key={currency.countryCode}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(currency.code, currency.countryCode);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <CircleFlag
                        countryCode={currency.countryCode}
                        height="28"
                        width="28"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">
                          {currency.code}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {currency.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.18)] p-8 md:p-10 overflow-visible">
        {/* You send exactly */}
        <div className="mb-8">
          <label className="block text-base font-normal text-gray-900 mb-4">
            You send
          </label>
          <div className="flex items-center gap-3 mb-4 min-w-0">
            <input
              type="text"
              value={formatNumberDisplay(fromAmount)}
              onChange={handleFromAmountChange}
              className="flex-1 min-w-0 text-4xl sm:text-5xl font-black outline-none bg-transparent text-left pl-2"
              style={{
                color: "#163300",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                letterSpacing: "-0.02em",
              }}
              placeholder="0.00"
            />
            <div className="relative flex-shrink-0" ref={fromDropdownRef}>
              <button
                onClick={() => {
                  setShowFromDropdown(!showFromDropdown);
                  setShowToDropdown(false);
                  setFromSearch("");
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                style={{ backgroundColor: "#16330014" }}
              >
                <CircleFlag countryCode={fromCountry} height="22" width="22" />
                <span className="text-base font-semibold text-gray-900">
                  {fromCurrency}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </button>
              {showFromDropdown &&
                renderCurrencyDropdown(
                  filteredFromCurrencies,
                  (code, countryCode) => {
                    setFromCurrency(code);
                    setFromCountry(countryCode);
                    setShowFromDropdown(false);
                    setFromSearch("");
                  },
                  fromSearch,
                  setFromSearch,
                  fromSearchRef,
                )}
            </div>
          </div>
        </div>

       

        {/* Recipient gets */}
        <div className="mb-8">
          <label className="block text-base font-normal text-gray-900 mb-4">
            Recipient receives
          </label>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex-1 min-w-0 text-4xl sm:text-5xl font-black text-left pl-2"
              style={{
                color: "#163300",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                letterSpacing: "-0.02em",
              }}
            >
              {loading ? (
                <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
              ) : (
                toAmount || "0.00"
              )}
            </div>
            <div className="relative flex-shrink-0" ref={toDropdownRef}>
              <button
                onClick={() => {
                  setShowToDropdown(!showToDropdown);
                  setShowFromDropdown(false);
                  setToSearch("");
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                style={{ backgroundColor: "#16330014" }}
              >
                <CircleFlag countryCode={toCountry} height="22" width="22" />
                <span className="text-base font-semibold text-gray-900">
                  {toCurrency}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </button>
              {showToDropdown &&
                renderCurrencyDropdown(
                  filteredToCurrencies,
                  (code, countryCode) => {
                    setToCurrency(code);
                    setToCountry(countryCode);
                    setShowToDropdown(false);
                    setToSearch("");
                  },
                  toSearch,
                  setToSearch,
                  toSearchRef,
                )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>
        
         {/* Exchange rate */}
        <div className="flex items-center justify-between mb-8 w-full px-4 py-3 rounded-full" style={{backgroundColor: "#16330014"}}>
          <span className="text-[14px] font-normal text-gray-600">Exchange rate</span>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-700 flex-shrink-0" />
            ) : exchangeRate ? (
              <span className="text-sm font-semibold text-gray-900">
                {formatExchangeRate(fromCurrency, toCurrency, exchangeRate)}
              </span>
            ) : (
              <span className="text-sm font-semibold text-gray-900">--</span>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6 mb-8">
          {/* Arrival time */}
          {/* <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: "#16330014"}}>
              <Zap className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-0.5">Arrives</div>
                <div className="text-base font-semibold text-gray-900">
                  Today - in seconds
                </div>
              </div>
              <Info className="w-5 h-5 text-gray-400" />
            </div>
          </div> */}

          {/* Fees */}
          {/* <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Receipt className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-0.5">Total fees</div>
                <div className="text-base font-semibold text-gray-900">
                  Included in {fromCurrency} amount
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold text-gray-900 underline">
                  5.48 {fromCurrency}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div> */}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Savings message */}
        {/* <p className="text-sm text-gray-600 mb-6">
          You could save up to 37.16 {fromCurrency}
        </p> */}

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Send Money Button */}
        <button className="w-full py-2 bg-[#9FE870] hover:bg-[#8dd661] font-semibold text-[18px] rounded-full transition-all" style={{color: "#163300"}}>
          Send money
        </button>
      </div>
    </div>
  );
};

export default BusinessCalculator;
