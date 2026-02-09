export interface Currency {
  code: string;
  name: string;
  countryCode: string; // ISO 3166-1 alpha-2 country code for flag icons
  region: string;
  provider: 'bridge' | 'yellowcard' | 'paytrie';
}

export const currencies: Currency[] = [
  // USD (base currency)
  {
    code: 'USD',
    name: 'United States Dollar',
    countryCode: 'us',
    region: 'Americas',
    provider: 'bridge'
  },

  // European currencies
  // EUR — Eurozone countries (all use EUR, routed through Bridge EUR rate)
  {
    code: 'EUR',
    name: 'Euro',
    countryCode: 'eu',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Germany',
    countryCode: 'de',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — France',
    countryCode: 'fr',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Italy',
    countryCode: 'it',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Spain',
    countryCode: 'es',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Netherlands',
    countryCode: 'nl',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Belgium',
    countryCode: 'be',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Austria',
    countryCode: 'at',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Ireland',
    countryCode: 'ie',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Portugal',
    countryCode: 'pt',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Greece',
    countryCode: 'gr',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Finland',
    countryCode: 'fi',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Slovakia',
    countryCode: 'sk',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Slovenia',
    countryCode: 'si',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Lithuania',
    countryCode: 'lt',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Latvia',
    countryCode: 'lv',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Estonia',
    countryCode: 'ee',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Luxembourg',
    countryCode: 'lu',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Cyprus',
    countryCode: 'cy',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Malta',
    countryCode: 'mt',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'EUR',
    name: 'Euro — Croatia',
    countryCode: 'hr',
    region: 'Europe',
    provider: 'bridge'
  },

  // GBP
  {
    code: 'GBP',
    name: 'British Pound',
    countryCode: 'gb',
    region: 'Europe',
    provider: 'bridge'
  },

  // Non-EUR European currencies (routed through EUR via Bridge)
  {
    code: 'CHF',
    name: 'Swiss Franc',
    countryCode: 'ch',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'SEK',
    name: 'Swedish Krona',
    countryCode: 'se',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'NOK',
    name: 'Norwegian Krone',
    countryCode: 'no',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'DKK',
    name: 'Danish Krone',
    countryCode: 'dk',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'PLN',
    name: 'Polish Zloty',
    countryCode: 'pl',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'CZK',
    name: 'Czech Koruna',
    countryCode: 'cz',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'HUF',
    name: 'Hungarian Forint',
    countryCode: 'hu',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'RON',
    name: 'Romanian Leu',
    countryCode: 'ro',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'BGN',
    name: 'Bulgarian Lev',
    countryCode: 'bg',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'ISK',
    name: 'Icelandic Krona',
    countryCode: 'is',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'TRY',
    name: 'Turkish Lira',
    countryCode: 'tr',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'UAH',
    name: 'Ukrainian Hryvnia',
    countryCode: 'ua',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'RSD',
    name: 'Serbian Dinar',
    countryCode: 'rs',
    region: 'Europe',
    provider: 'bridge'
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    countryCode: 'mx',
    region: 'Americas',
    provider: 'bridge'
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    countryCode: 'br',
    region: 'Americas',
    provider: 'bridge'
  },

  // Paytrie API Currency
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    countryCode: 'ca',
    region: 'Americas',
    provider: 'paytrie'
  },

  // YellowCard API Currencies (African countries)
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    countryCode: 'ng',
    region: 'Africa',
    provider: 'yellowcard'
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    countryCode: 'ke',
    region: 'Africa',
    provider: 'yellowcard'
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    countryCode: 'gh',
    region: 'Africa',
    provider: 'yellowcard'
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    countryCode: 'za',
    region: 'Africa',
    provider: 'yellowcard'
  },
  {
    code: 'UGX',
    name: 'Ugandan Shilling',
    countryCode: 'ug',
    region: 'Africa',
    provider: 'yellowcard'
  },
  {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    countryCode: 'tz',
    region: 'Africa',
    provider: 'yellowcard'
  },
  {
    code: 'RWF',
    name: 'Rwandan Franc',
    countryCode: 'rw',
    region: 'Africa',
    provider: 'yellowcard'
  },
  {
    code: 'XOF',
    name: 'West African CFA Franc',
    countryCode: 'sn', // Senegal as representative
    region: 'Africa',
    provider: 'yellowcard'
  },
  {
    code: 'XAF',
    name: 'Central African CFA Franc',
    countryCode: 'cm', // Cameroon as representative
    region: 'Africa',
    provider: 'yellowcard'
  },
  {
    code: 'ZMW',
    name: 'Zambian Kwacha',
    countryCode: 'zm',
    region: 'Africa',
    provider: 'yellowcard'
  }
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find(c => c.code.toUpperCase() === code.toUpperCase());
};

export const getCurrenciesByRegion = (region: string): Currency[] => {
  return currencies.filter(c => c.region === region);
};

export const getCurrenciesByProvider = (provider: 'bridge' | 'yellowcard' | 'paytrie'): Currency[] => {
  return currencies.filter(c => c.provider === provider);
};
