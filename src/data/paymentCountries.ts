export type Provider = 'yellowcard' | 'bridge' | 'paytrie';
export type PaymentMethod = 'bank' | 'momo' | 'interac' | 'ach' | 'wire' | 'sepa' | 'spei' | 'pix' | 'faster_payments';

export interface PaymentCountry {
  name: string;
  code: string;       // ISO alpha-2 for YellowCard/Paytrie, alpha-3 for Bridge-only
  countryCode: string; // always alpha-2 for flag icons
  flag: string;
  currency: string;
  currencySymbol: string;
  provider: Provider;
  depositMethods: PaymentMethod[];
  withdrawMethods: PaymentMethod[];
}

// ── YellowCard countries ────────────────────────────────────────────────────
const yellowcardCountries: PaymentCountry[] = [
  { name: 'Benin', code: 'BJ', countryCode: 'bj', flag: '🇧🇯', currency: 'XOF', currencySymbol: 'CFA', provider: 'yellowcard', depositMethods: ['momo'], withdrawMethods: ['momo'] },
  { name: 'Botswana', code: 'BW', countryCode: 'bw', flag: '🇧🇼', currency: 'BWP', currencySymbol: 'P', provider: 'yellowcard', depositMethods: ['bank', 'momo'], withdrawMethods: ['bank', 'momo'] },
  { name: 'Cameroon', code: 'CM', countryCode: 'cm', flag: '🇨🇲', currency: 'XAF', currencySymbol: 'CFA', provider: 'yellowcard', depositMethods: ['momo'], withdrawMethods: ['momo'] },
  { name: "Côte d'Ivoire", code: 'CI', countryCode: 'ci', flag: '🇨🇮', currency: 'XOF', currencySymbol: 'CFA', provider: 'yellowcard', depositMethods: ['momo'], withdrawMethods: ['momo'] },
  { name: 'DR Congo', code: 'CD', countryCode: 'cd', flag: '🇨🇩', currency: 'CDF', currencySymbol: 'FC', provider: 'yellowcard', depositMethods: [], withdrawMethods: ['momo'] },
  { name: 'Republic of Congo', code: 'CG', countryCode: 'cg', flag: '🇨🇬', currency: 'XAF', currencySymbol: 'CFA', provider: 'yellowcard', depositMethods: ['momo'], withdrawMethods: ['momo'] },
  { name: 'Gabon', code: 'GA', countryCode: 'ga', flag: '🇬🇦', currency: 'XAF', currencySymbol: 'CFA', provider: 'yellowcard', depositMethods: ['bank'], withdrawMethods: [] },
  { name: 'Ghana', code: 'GH', countryCode: 'gh', flag: '🇬🇭', currency: 'GHS', currencySymbol: '₵', provider: 'yellowcard', depositMethods: ['momo'], withdrawMethods: ['bank'] },
  { name: 'Kenya', code: 'KE', countryCode: 'ke', flag: '🇰🇪', currency: 'KES', currencySymbol: 'KSh', provider: 'yellowcard', depositMethods: ['momo'], withdrawMethods: ['bank', 'momo'] },
  { name: 'Malawi', code: 'MW', countryCode: 'mw', flag: '🇲🇼', currency: 'MWK', currencySymbol: 'MK', provider: 'yellowcard', depositMethods: ['bank', 'momo'], withdrawMethods: ['bank', 'momo'] },
  { name: 'Nigeria', code: 'NG', countryCode: 'ng', flag: '🇳🇬', currency: 'NGN', currencySymbol: '₦', provider: 'yellowcard', depositMethods: ['bank'], withdrawMethods: ['bank'] },
  { name: 'Rwanda', code: 'RW', countryCode: 'rw', flag: '🇷🇼', currency: 'RWF', currencySymbol: 'FRw', provider: 'yellowcard', depositMethods: ['bank', 'momo'], withdrawMethods: ['bank', 'momo'] },
  { name: 'South Africa', code: 'ZA', countryCode: 'za', flag: '🇿🇦', currency: 'ZAR', currencySymbol: 'R', provider: 'yellowcard', depositMethods: ['bank'], withdrawMethods: ['bank'] },
  { name: 'Tanzania', code: 'TZ', countryCode: 'tz', flag: '🇹🇿', currency: 'TZS', currencySymbol: 'TSh', provider: 'yellowcard', depositMethods: ['bank', 'momo'], withdrawMethods: ['bank', 'momo'] },
  { name: 'Togo', code: 'TG', countryCode: 'tg', flag: '🇹🇬', currency: 'XOF', currencySymbol: 'CFA', provider: 'yellowcard', depositMethods: ['momo'], withdrawMethods: ['momo'] },
  { name: 'Uganda', code: 'UG', countryCode: 'ug', flag: '🇺🇬', currency: 'UGX', currencySymbol: 'USh', provider: 'yellowcard', depositMethods: ['bank', 'momo'], withdrawMethods: ['bank', 'momo'] },
  { name: 'Zambia', code: 'ZM', countryCode: 'zm', flag: '🇿🇲', currency: 'ZMW', currencySymbol: 'ZK', provider: 'yellowcard', depositMethods: ['bank', 'momo'], withdrawMethods: ['bank', 'momo'] },
  { name: 'Senegal', code: 'SN', countryCode: 'sn', flag: '🇸🇳', currency: 'XOF', currencySymbol: 'CFA', provider: 'yellowcard', depositMethods: [], withdrawMethods: ['momo'] },
];

// ── Bridge countries ────────────────────────────────────────────────────────
const bridgeCountries: PaymentCountry[] = [
  { name: 'United States', code: 'US', countryCode: 'us', flag: '🇺🇸', currency: 'USD', currencySymbol: '$', provider: 'bridge', depositMethods: ['ach'], withdrawMethods: ['ach', 'wire'] },
  { name: 'United Kingdom', code: 'GB', countryCode: 'gb', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£', provider: 'bridge', depositMethods: ['faster_payments'], withdrawMethods: ['faster_payments', 'wire'] },
  { name: 'Eurozone', code: 'EU', countryCode: 'eu', flag: '🇪🇺', currency: 'EUR', currencySymbol: '€', provider: 'bridge', depositMethods: ['sepa'], withdrawMethods: ['sepa', 'wire'] },
  { name: 'Mexico', code: 'MX', countryCode: 'mx', flag: '🇲🇽', currency: 'MXN', currencySymbol: '$', provider: 'bridge', depositMethods: ['spei'], withdrawMethods: ['spei'] },
  { name: 'Brazil', code: 'BR', countryCode: 'br', flag: '🇧🇷', currency: 'BRL', currencySymbol: 'R$', provider: 'bridge', depositMethods: ['pix'], withdrawMethods: ['pix'] },
];

// ── Paytrie ─────────────────────────────────────────────────────────────────
const paytrieCountries: PaymentCountry[] = [
  { name: 'Canada', code: 'CA', countryCode: 'ca', flag: '🇨🇦', currency: 'CAD', currencySymbol: '$', provider: 'paytrie', depositMethods: ['interac'], withdrawMethods: [] },
];

export const allPaymentCountries: PaymentCountry[] = [
  ...bridgeCountries,
  ...yellowcardCountries,
  ...paytrieCountries,
].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

export const getDepositCountries = (): PaymentCountry[] =>
  allPaymentCountries.filter(c => c.depositMethods.length > 0);

export const getWithdrawCountries = (): PaymentCountry[] =>
  allPaymentCountries.filter(c => c.withdrawMethods.length > 0);

export const getCountryByCode = (code: string): PaymentCountry | undefined =>
  allPaymentCountries.find(c => c.code === code);

export const MOMO_CURRENCIES = new Set(['GHS', 'KES', 'UGX', 'TZS', 'RWF', 'ZMW', 'MWK', 'BWP', 'XAF', 'XOF', 'CDF']);

export function isMomoCurrency(currency: string): boolean {
  return MOMO_CURRENCIES.has(currency);
}

export function getMethodLabel(currency: string): string {
  if (currency === 'CAD') return 'Interac e-Transfer';
  if (currency === 'USD') return 'ACH / Wire';
  if (currency === 'EUR') return 'SEPA';
  if (currency === 'GBP') return 'Faster Payments / Wire';
  if (currency === 'MXN') return 'SPEI';
  if (currency === 'BRL') return 'PIX';
  if (isMomoCurrency(currency)) return 'Mobile Money';
  return 'Bank Transfer';
}

export const COUNTRY_PHONE_PREFIXES: Record<string, string> = {
  NG: '+234', KE: '+254', GH: '+233', UG: '+256', TZ: '+255',
  ZA: '+27', RW: '+250', ZM: '+260', MW: '+265', BW: '+267',
  SN: '+221', CI: '+225', CM: '+237', BJ: '+229', TG: '+228',
  CG: '+242', CD: '+243', GA: '+241',
};
