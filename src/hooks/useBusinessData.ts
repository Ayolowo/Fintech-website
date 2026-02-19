'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessApi } from '@/services/businessApi';
import { useAuth } from './useAuth';
import type {
  CreateBusinessProfileRequest,
  SendMoneyRequest,
} from '@/types/business';

export function useBusinessProfile(enabled: boolean = true) {
  const { getAuthToken, authenticated, user } = useAuth();

  return useQuery({
    queryKey: ['business-profile', user?.email?.address],
    queryFn: async () => {
      const token = await getAuthToken();
      const email = user?.email?.address;

      if (!email) {
        throw new Error('User email not found');
      }

      // Check if user profile exists using /api/check-user
      const checkResult = await businessApi.checkUserProfile(token, email);

      if (!checkResult.exists) {
        return null;
      }

      // For businesses: only check if status is 'complete' (no Persona required)
      // For individuals: check both status and persona_status (Persona required)
      const isBusiness = checkResult.customer_type === 'business';

      if (isBusiness) {
        // Business: only need profile to be complete
        if (checkResult.status !== 'complete') {
          return null;
        }
      } else {
        // Individual: need both profile complete AND persona completed
        if (checkResult.status !== 'complete' || checkResult.persona_status !== 'completed') {
          return null;
        }
      }

      // Get full profile data from backend
      const profileResponse = await fetch(
        `/api/profile/email/${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const result = await profileResponse.json();
      // The endpoint returns {success: true, profile: {...}}
      return result.profile || result;
    },
    enabled: enabled && authenticated && !!user?.email?.address,
    retry: false,
    staleTime: Infinity, // Only refetch when explicitly invalidated
    gcTime: Infinity, // Keep cache alive even when all subscribers unmount
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useCreateBusinessProfile() {
  const { getAuthToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBusinessProfileRequest) => {
      const token = await getAuthToken();
      return businessApi.createBusinessProfile(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-profile'] });
    },
  });
}

export function useWalletBalances() {
  const { getAuthToken, authenticated } = useAuth();

  return useQuery({
    queryKey: ['wallet-balances'],
    queryFn: async () => {
      const token = await getAuthToken();
      return businessApi.getWalletBalances(token);
    },
    enabled: authenticated,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}

export function useTransactions(
  walletAddress?: string,
  filters?: {
    limit?: number;
    offset?: number;
  }
) {
  const { getAuthToken, authenticated } = useAuth();

  return useQuery({
    queryKey: ['transactions', walletAddress, filters],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error('Wallet address is required');
      }
      const token = await getAuthToken();

      // Fetch both business transactions and partner transactions
      const [businessTxs, partnerTxs] = await Promise.all([
        businessApi.getTransactions(token, walletAddress, filters),
        businessApi.getPartnerTransactions(token, walletAddress, filters),
      ]);

      // Merge and sort by created_at
      const allTransactions = [
        ...(businessTxs.data || []),
        ...(partnerTxs.data || []),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return {
        success: true,
        data: allTransactions,
        pagination: businessTxs.pagination,
      };
    },
    enabled: authenticated && !!walletAddress,
    staleTime: Infinity, // Never consider data stale
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount
    refetchOnReconnect: false, // Don't refetch on reconnect
  });
}

export function useInitiateDeposit() {
  const { getAuthToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, currency }: { amount: number; currency: string }) => {
      const token = await getAuthToken();
      return businessApi.initiateDeposit(token, amount, currency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balances'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useInitiateSend() {
  const { getAuthToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendMoneyRequest) => {
      const token = await getAuthToken();
      return businessApi.initiateSend(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balances'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useBridgeKYCStatus() {
  const { getAuthToken, authenticated } = useAuth();

  return useQuery({
    queryKey: ['bridge-kyc-status'],
    queryFn: async () => {
      const token = await getAuthToken();
      return businessApi.getBridgeKYCStatus(token);
    },
    enabled: authenticated,
  });
}

export function useInitiateBridgeKYC() {
  const { getAuthToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getAuthToken();
      return businessApi.initiateBridgeKYC(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridge-kyc-status'] });
    },
  });
}
