const API_BASE_URL = 'https://paybridge-go.onrender.com';

export interface BridgeExchangeRate {
  currency: string;
  direction: string;
  midmarket_rate: number;
  buy_rate: number;
  sell_rate: number;
  updated_at: string;
}

export interface YellowCardRate {
  code: string;
  buy: number;
  sell: number;
  mid: number;
}

export interface PaytrieQuote {
  leftSideLabel: string;
  leftSideValue: string;
  rightSideLabel: string;
  rightSideValue: string;
  cadusd: number;
  quoteId: number;
}

export interface ExchangeRateResult {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  fromAmount: number;
  toAmount: number;
  fee: number;
  provider: 'bridge' | 'yellowcard' | 'paytrie';
}

/**
 * Fetch Bridge exchange rate for EUR, MXN, BRL, GBP
 */
export async function getBridgeExchangeRate(
  currency: string,
  direction: 'usd_to_fiat' | 'fiat_to_usd' = 'usd_to_fiat'
): Promise<BridgeExchangeRate> {
  const url = `${API_BASE_URL}/public/bridge/exchange-rates?currency=${currency.toLowerCase()}&direction=${direction}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Bridge rate for ${currency}: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Fetch YellowCard rates for African currencies
 */
export async function getYellowCardRates(currency?: string): Promise<YellowCardRate[]> {
  const url = currency
    ? `${API_BASE_URL}/public/business/rates?currency=${currency.toUpperCase()}`
    : `${API_BASE_URL}/public/business/rates`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch YellowCard rates: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Fetch Paytrie price quote for CAD
 */
export async function getPaytrieQuote(
  leftSideLabel: string,
  leftSideValue: string,
  rightSideLabel: string
): Promise<PaytrieQuote> {
  const url = `${API_BASE_URL}/public/paytrie/price-quote?leftSideLabel=${leftSideLabel}&leftSideValue=${leftSideValue}&rightSideLabel=${rightSideLabel}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Paytrie quote: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Calculate exchange rate between any two supported currencies
 * Uses the same logic as the React Native app: FROM → USD → TO
 */
export async function calculateExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  amount: number
): Promise<ExchangeRateResult> {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  // Same currency
  if (from === to) {
    return {
      fromCurrency: from,
      toCurrency: to,
      rate: 1,
      fromAmount: amount,
      toAmount: amount,
      fee: 0,
      provider: 'bridge'
    };
  }

  // Step 1: Convert FROM currency → USD
  const toUsdResult = await convertToUSD(from, amount);

  // Step 2: Convert USD → TO currency
  const toFinalResult = await convertFromUSD(to, toUsdResult.usdAmount);

  // Step 3: Calculate effective rate
  const effectiveRate = toFinalResult.localAmount / amount;

  return {
    fromCurrency: from,
    toCurrency: to,
    rate: effectiveRate,
    fromAmount: amount,
    toAmount: toFinalResult.localAmount,
    fee: 0,
    provider: toUsdResult.provider
  };
}

/**
 * Convert any currency to USD
 */
async function convertToUSD(currency: string, amount: number): Promise<{ usdAmount: number; provider: 'bridge' | 'yellowcard' | 'paytrie' }> {
  const cur = currency.toUpperCase();

  // Already USD
  if (cur === 'USD') {
    return { usdAmount: amount, provider: 'bridge' };
  }

  // Bridge currencies (EUR, MXN, BRL, GBP)
  const bridgeCurrencies = ['EUR', 'MXN', 'BRL', 'GBP'];
  if (bridgeCurrencies.includes(cur)) {
    const data = await getBridgeExchangeRate(cur.toLowerCase(), 'fiat_to_usd');
    // sell_rate = Fiat → USD rate (includes Bridge fees)
    return {
      usdAmount: amount * data.sell_rate,
      provider: 'bridge'
    };
  }

  // European currencies — route through EUR via Bridge
  const euroCurrencies = ['CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'ISK', 'TRY', 'UAH', 'RSD'];
  if (euroCurrencies.includes(cur)) {
    const data = await getBridgeExchangeRate('eur', 'fiat_to_usd');
    return {
      usdAmount: amount * data.sell_rate,
      provider: 'bridge'
    };
  }

  // CAD via Paytrie
  if (cur === 'CAD') {
    const quote = await getPaytrieQuote('CAD', amount.toFixed(2), 'USDC-SOL');
    return {
      usdAmount: parseFloat(quote.rightSideValue),
      provider: 'paytrie'
    };
  }

  // YellowCard currencies (NGN, KES, GHS, etc.)
  const yellowCardCurrencies = ['NGN', 'KES', 'GHS', 'ZAR', 'UGX', 'TZS', 'RWF', 'XOF', 'XAF', 'ZMW'];
  if (yellowCardCurrencies.includes(cur)) {
    const rates = await getYellowCardRates(cur);
    if (rates.length === 0) {
      throw new Error(`No rate found for ${cur}`);
    }
    // For collections (adding money): local currency → USD
    // Use buy rate (what YellowCard buys local currency for)
    const rate = 1 / rates[0].buy;
    return {
      usdAmount: amount * rate,
      provider: 'yellowcard'
    };
  }

  throw new Error(`Unsupported currency: ${cur}`);
}

/**
 * Convert USD to any currency
 */
async function convertFromUSD(currency: string, usdAmount: number): Promise<{ localAmount: number; provider: 'bridge' | 'yellowcard' | 'paytrie' }> {
  const cur = currency.toUpperCase();

  // Already USD
  if (cur === 'USD') {
    return { localAmount: usdAmount, provider: 'bridge' };
  }

  // Bridge currencies (EUR, MXN, BRL, GBP)
  const bridgeCurrencies = ['EUR', 'MXN', 'BRL', 'GBP'];
  if (bridgeCurrencies.includes(cur)) {
    const data = await getBridgeExchangeRate(cur.toLowerCase(), 'usd_to_fiat');
    // sell_rate = USD → Fiat rate (includes Bridge fees)
    return {
      localAmount: usdAmount * data.sell_rate,
      provider: 'bridge'
    };
  }

  // European currencies — route through EUR via Bridge
  const euroCurrencies = ['CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'ISK', 'TRY', 'UAH', 'RSD'];
  if (euroCurrencies.includes(cur)) {
    const data = await getBridgeExchangeRate('eur', 'usd_to_fiat');
    return {
      localAmount: usdAmount * data.sell_rate,
      provider: 'bridge'
    };
  }

  // CAD via Paytrie
  if (cur === 'CAD') {
    const quote = await getPaytrieQuote('USDC-SOL', usdAmount.toFixed(2), 'CAD');
    return {
      localAmount: parseFloat(quote.rightSideValue),
      provider: 'paytrie'
    };
  }

  // YellowCard currencies (NGN, KES, GHS, etc.)
  const yellowCardCurrencies = ['NGN', 'KES', 'GHS', 'ZAR', 'UGX', 'TZS', 'RWF', 'XOF', 'XAF', 'ZMW'];
  if (yellowCardCurrencies.includes(cur)) {
    const rates = await getYellowCardRates(cur);
    if (rates.length === 0) {
      throw new Error(`No rate found for ${cur}`);
    }
    // For withdrawals (sending money out): USD → local currency
    // Use sell rate (what YellowCard sells local currency for)
    return {
      localAmount: usdAmount * rates[0].sell,
      provider: 'yellowcard'
    };
  }

  throw new Error(`Unsupported currency: ${cur}`);
}

/**
 * Format currency amount with appropriate decimals
 */
export function formatCurrencyAmount(amount: number, currency: string): string {
  // Most currencies use 2 decimal places
  const decimals = ['JPY', 'KRW'].includes(currency) ? 0 : 2;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

/**
 * Format exchange rate display (e.g., "1 GBP = 1.14 EUR")
 */
export function formatExchangeRate(fromCurrency: string, toCurrency: string, rate: number): string {
  const formattedRate = formatCurrencyAmount(rate, toCurrency);
  return `1 ${fromCurrency} = ${formattedRate} ${toCurrency}`;
}
