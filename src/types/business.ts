export interface BusinessProfile {
  id: string;
  privy_user_id: string;
  business_name: string;
  business_type: string; // Free text: "Auto Dealers", "Food Company", etc.
  customer_type: 'business' | 'individual';
  country: string;
  email: string;
  phone?: string;
  kyc_status: 'not_started' | 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  currency: string;
  balance: number;
  account_number?: string;
  wallet_address?: string;
}

export interface Transaction {
  id: string;
  wallet_address: string;
  recipient_name: string;
  recipient_bank_name?: string;
  recipient_account_number?: string;
  recipient_routing_number?: string;
  recipient_address_street?: string;
  recipient_address_city?: string;
  recipient_address_state?: string;
  recipient_address_postal_code?: string;
  recipient_address_country?: string;
  amount_usdc: number;
  amount_fiat: number;
  fiat_currency: string;
  exchange_rate: number;
  payment_method: string;
  bridge_transaction_id: string;
  bridge_deposit_address?: string;
  bridge_deposit_amount?: number;
  transaction_hash?: string;
  status: string;
  estimated_completion_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DepositInstructions {
  currency: string;
  amount: number;
  provider: 'yellowcard' | 'bridge';
  instructions: {
    account_number?: string;
    bank_name?: string;
    routing_number?: string;
    reference?: string;
  };
}

export interface SendMoneyRequest {
  currency: string;
  amount: number;
  recipient: {
    bank_account?: string;
    bank_code?: string;
    routing_number?: string;
    account_number?: string;
    account_name?: string;
  };
}

export interface BridgeKYCStatus {
  status: 'not_started' | 'pending' | 'approved' | 'rejected';
  kyc_link?: string;
  required_documents?: string[];
}

export interface CreateBusinessProfileRequest {
  customer_type: 'business'; // Always 'business' for business dashboard
  business_name: string;
  business_type: string; // Free text: "Auto Dealers", "Food Company", etc.
  registration_no: string;
  phone_number: string;
  country: string;
  email: string;
  business_email: string;
  wallet_address: string;
  privy_user_id: string;
  status: 'complete';
}
