import { authenticatedFetch } from './apiClient';
import type {
  BusinessProfile,
  WalletBalance,
  Transaction,
  DepositInstructions,
  SendMoneyRequest,
  BridgeKYCStatus,
  CreateBusinessProfileRequest,
} from '@/types/business';

export const businessApi = {
  // Business Profile - Check if user profile exists
  async checkUserProfile(accessToken: string, email: string): Promise<{
    exists: boolean;
    status?: string;
    persona_status?: string;
    customer_type?: string;
  }> {
    return authenticatedFetch<{
      exists: boolean;
      status?: string;
      persona_status?: string;
      customer_type?: string;
    }>('/api/check-user', accessToken, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async getBusinessProfile(accessToken: string): Promise<BusinessProfile> {
    return authenticatedFetch<BusinessProfile>('/api/business/profile', accessToken);
  },

  async createBusinessProfile(
    accessToken: string,
    data: CreateBusinessProfileRequest
  ): Promise<BusinessProfile> {
    // Use the same endpoint as RN app: /api/save-kyc
    return authenticatedFetch<BusinessProfile>('/api/save-kyc', accessToken, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBusinessProfile(
    accessToken: string,
    data: Partial<CreateBusinessProfileRequest>
  ): Promise<BusinessProfile> {
    return authenticatedFetch<BusinessProfile>('/api/business/profile', accessToken, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Wallet
  async getWalletBalances(accessToken: string): Promise<WalletBalance[]> {
    return authenticatedFetch<WalletBalance[]>('/api/business/wallet/balances', accessToken);
  },

  // Transactions
  async getTransactions(
    accessToken: string,
    walletAddress: string,
    filters?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<{ success: boolean; data: Transaction[]; pagination: { limit: number; offset: number } }> {
    const params = new URLSearchParams();
    params.append('wallet_address', walletAddress);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/business/transactions?${queryString}`;

    return authenticatedFetch<{ success: boolean; data: Transaction[]; pagination: { limit: number; offset: number } }>(
      endpoint,
      accessToken
    );
  },

  // Partner Transactions (Add/Withdraw money via YellowCard/Paytrie)
  async getPartnerTransactions(
    accessToken: string,
    walletAddress: string,
    filters?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<{ success: boolean; data: any[]; pagination: { limit: number; offset: number } }> {
    const params = new URLSearchParams();
    params.append('wallet_address', walletAddress);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/business/partner-transactions?${queryString}`;

    return authenticatedFetch<{ success: boolean; data: any[]; pagination: { limit: number; offset: number } }>(
      endpoint,
      accessToken
    );
  },

  // Deposit
  async initiateDeposit(
    accessToken: string,
    amount: number,
    currency: string
  ): Promise<DepositInstructions> {
    return authenticatedFetch<DepositInstructions>('/api/business/deposit', accessToken, {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  },

  // Send Money
  async initiateSend(
    accessToken: string,
    data: SendMoneyRequest
  ): Promise<Transaction> {
    return authenticatedFetch<Transaction>('/api/business/send', accessToken, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Bridge KYC
  async getBridgeKYCStatus(accessToken: string): Promise<BridgeKYCStatus> {
    return authenticatedFetch<BridgeKYCStatus>('/api/business/kyc/status', accessToken);
  },

  async initiateBridgeKYC(accessToken: string): Promise<BridgeKYCStatus> {
    return authenticatedFetch<BridgeKYCStatus>('/api/business/kyc/initiate', accessToken, {
      method: 'POST',
    });
  },
};
