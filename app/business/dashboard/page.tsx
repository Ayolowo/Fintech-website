"use client";

import { useTransactions } from "@/hooks/useBusinessData";
import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { SendMoneyModal } from "@/components/business/modals/SendMoneyModal";
import { AddMoneyModal } from "@/components/business/modals/AddMoneyModal";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
} from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function BusinessDashboardPage() {
  const { user, ready } = usePrivy();
  const { getAuthToken, authenticated } = useAuth();
  const queryClient = useQueryClient();

  // Auth and profile checks are handled by ProtectedRoute in the layout

  // Get the Solana embedded wallet from linked accounts
  const solanaWallet = user?.linkedAccounts?.find(
    (account: any) =>
      account.type === "wallet" &&
      account.chainType === "solana" &&
      account.walletClientType === "privy",
  ) as any;

  const { data: transactionsData, isLoading: transactionsLoading } =
    useTransactions(solanaWallet?.address, { limit: 20 });
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const [showKYCPrompt, setShowKYCPrompt] = useState(false);
  const [tosLink, setTosLink] = useState("");
  const [kycLink, setKycLink] = useState("");

  // Check partner KYC status and handle TOS/KYC flow
  useEffect(() => {
    if (ready && user?.email?.address) {
      getAuthToken().then(async (token) => {
        try {
          // Check partner KYC - this automatically initiates Bridge KYC if needed
          const kycCheckResponse = await fetch(
            `/api/check-partner-kyc`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userEmail: user.email.address,
                targetCurrency: "USD", // Check for USD/Bridge
              }),
            },
          );

          if (kycCheckResponse.ok) {
            const kycCheck = await kycCheckResponse.json();

            // If already verified, nothing to show
            if (kycCheck.isVerified) {
              return;
            }

            // If has verification link (TOS or KYC), show appropriate flow
            if (kycCheck.hasVerificationLink) {
              // Check TOS status first
              if (kycCheck.tosStatus !== "approved" && kycCheck.tosLink) {
                // Show TOS iframe
                setTosLink(kycCheck.tosLink);
                setKycLink(kycCheck.verificationLink || "");
                setShowTOS(true);
              } else if (kycCheck.bridgeKycStatus !== "approved" && kycCheck.verificationLink) {
                // TOS done but KYC not complete, show KYC prompt
                setKycLink(kycCheck.verificationLink);
                setShowKYCPrompt(true);
              }
            }
          }
        } catch (error) {
          console.error("KYC check failed:", error);
        }
      });
    }
  }, [ready, user, getAuthToken]);

  // Listen for postMessage from Bridge TOS iframe
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin is from Bridge
      if (!event.origin.includes("bridge.xyz")) return;

      const { signedAgreementId } = event.data;

      if (signedAgreementId && user?.email?.address) {
        try {
          const token = await getAuthToken();

          // Save TOS acceptance
          const response = await fetch(
            `/api/bridge/tos/save-acceptance`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email.address,
                signedAgreementId,
              }),
            }
          );

          if (response.ok) {
            // TOS accepted, close modal and redirect to KYC
            setShowTOS(false);
            if (kycLink) {
              window.location.href = kycLink;
            }
          }
        } catch (error) {
          console.error("Failed to save TOS acceptance:", error);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [user, getAuthToken, kycLink]);

  // Fetch USDC balance from Solana wallet via backend
  useEffect(() => {
    async function fetchBalance() {
      if (ready && solanaWallet) {
        try {
          const token = await getAuthToken();

          // Call backend to fetch Solana USDC balance via Alchemy RPC
          const response = await fetch(
            `/api/business/wallet/solana-balance?wallet_address=${solanaWallet.address}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.ok) {
            const data = await response.json();

            // Parse the USDC balance from response
            const usdcBalance = data.balances?.find(
              (b: any) => b.asset === "usdc" && b.chain === "solana",
            );

            if (usdcBalance?.display_values?.usdc) {
              const balance = parseFloat(usdcBalance.display_values.usdc);
              setWalletBalance(balance);
            } else {
              setWalletBalance(0);
            }
          } else {
            setWalletBalance(0);
          }
        } catch (error) {
          setWalletBalance(0);
        } finally {
          setWalletLoading(false);
        }
      } else if (ready && !solanaWallet) {
        setWalletBalance(0);
        setWalletLoading(false);
      }
    }
    fetchBalance();
  }, [ready, solanaWallet, getAuthToken]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          View and manage all your business transactions
        </p>
      </div>

      {/* USD Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 ring-1 ring-gray-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CircleFlag countryCode="us" height="24" width="24" />
              <span className="text-[15px] font-medium text-black">
                USD Balance
              </span>
            </div>
          </div>
          {walletLoading ? (
            <Skeleton className="h-10 w-32 mb-2" />
          ) : (
            <div className="text-4xl font-bold text-black mb-2">
              {formatCurrency(walletBalance || 0, "USD")}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h3 className="text-[15px] font-medium mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setAddMoneyOpen(true)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-black hover:bg-gray-50 flex items-center justify-start"
            >
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Add Money
            </button>
            <button
              onClick={() => setSendMoneyOpen(true)}
              className="w-full px-4 py-2.5 text-white rounded-lg text-sm font-medium flex items-center justify-start"
              style={{ backgroundColor: "#163300", color: "#9FE870" }}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Send Money
            </button>
          </div>
        </div>
      </div>

      {/* All Transactions */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
        {/* Table Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-bold text-black">
              All Transactions
            </h2>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions"
                className="w-full md:w-64 pl-9 pr-4 py-2 text-black border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          {transactionsLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : transactionsData?.data &&
            transactionsData.data.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-black">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-black">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-black">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-black">Payment Method</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-black">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-black">USD Equivalent</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionsData.data.slice(0, 5).map((transaction) => {
                  const isDeposit = transaction.type === 'add' ||
                                   (transaction.payment_method === 'ach' && transaction.recipient_name);
                  const isPayout = transaction.type === 'withdraw' ||
                                  (transaction.payment_method && !isDeposit);
                  const displayName = transaction.name || transaction.recipient_name;

                  return (
                    <tr key={transaction.id} className="border-b border-gray-100">
                      <td className="py-5 px-6">
                        <p className="text-sm text-black">
                          {new Date(transaction.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </td>
                      <td className="py-5 px-6 text-sm text-black">
                        {isPayout ? 'Payout' : 'Deposit'}
                      </td>
                      <td className="py-5 px-6 text-sm text-black">
                        {isPayout && displayName
                          ? `Sent to ${displayName}`
                          : isPayout
                          ? 'Sent to Bank account'
                          : displayName || 'Deposit'
                        }
                      </td>
                      <td className="py-5 px-6 text-sm text-black capitalize">
                        {transaction.payment_method || '—'}
                      </td>
                      <td className="py-5 px-6 text-sm font-medium text-black">
                        {formatCurrency(transaction.amount_fiat, transaction.fiat_currency)}
                      </td>
                      <td className="py-5 px-6 text-sm text-black">
                        ${transaction.amount_usdc?.toFixed(2)}
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-block px-3 py-1 rounded-md text-sm ${
                          transaction.status === 'success'
                            ? 'bg-green-50 text-green-700'
                            : transaction.status === 'pending' || transaction.status === 'processing'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {transaction.status === 'success' ? 'Successful' : transaction.status === 'processing' ? 'Processing' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-black-900 mb-2">No transactions yet</p>
              <p className="text-sm text-black-500 max-w-sm text-center">
                Start by depositing money or sending a payment to see your transaction history
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Money Modal */}
      <AddMoneyModal
        open={addMoneyOpen}
        onOpenChange={setAddMoneyOpen}
        onSuccess={() => {
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }}
      />

      {/* Send Money Modal */}
      <SendMoneyModal
        open={sendMoneyOpen}
        onOpenChange={setSendMoneyOpen}
        walletBalance={walletBalance || 0}
        onSuccess={() => {
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }}
      />

      {/* TOS Modal */}
      {showTOS && tosLink && (
        <div className="fixed inset-0 z-50 bg-white">
          <iframe
            src={tosLink}
            className="w-full h-full border-none"
          />
        </div>
      )}

      {/* KYC Prompt Banner */}
      {showKYCPrompt && kycLink && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900">
                Verification Required
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Complete your identity verification to unlock full platform access
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open(kycLink, '_blank')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700"
              >
                Complete Verification
              </button>
              <button
                onClick={() => setShowKYCPrompt(false)}
                className="text-yellow-700 hover:text-yellow-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
