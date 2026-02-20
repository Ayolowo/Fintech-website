'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useBusinessData';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TransactionsPage() {
  const { user } = usePrivy();
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Get the Solana embedded wallet from linked accounts
  const solanaWallet = user?.linkedAccounts?.find(
    (account: any) =>
      account.type === 'wallet' &&
      account.chainType === 'solana' &&
      account.walletClientType === 'privy',
  ) as any;

  const { data: transactionsData, isLoading } = useTransactions(
    solanaWallet?.address,
    {
      limit,
      offset: (page - 1) * limit,
    }
  );

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredTransactions = transactionsData?.data?.filter((transaction) => {
    const matchesSearch = searchQuery
      ? (transaction.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         transaction.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesCurrency = currencyFilter !== 'all'
      ? transaction.fiat_currency === currencyFilter
      : true;

    const matchesStatus = statusFilter !== 'all'
      ? transaction.status === statusFilter
      : true;

    return matchesSearch && matchesCurrency && matchesStatus;
  });

  const totalPages = Math.ceil((filteredTransactions?.length || 0) / limit);
  const paginatedTransactions = filteredTransactions?.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-gray-500 mt-1">View and filter your transaction history</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription className="hidden md:block">Filter transactions by currency, type, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="relative sm:col-span-2 md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
                <SelectItem value="NGN">NGN</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="send">Send</SelectItem>
                <SelectItem value="receive">Receive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions?.length || 0} total transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : paginatedTransactions && paginatedTransactions.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => {
                      const isDeposit = transaction.payment_method === 'ach' && transaction.recipient_name;
                      const isPayout = !isDeposit;

                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">{formatDate(transaction.created_at)}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize ${isPayout ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'}`}
                            >
                              {isPayout ? 'Payout' : 'Deposit'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">
                                {isPayout
                                  ? `To ${transaction.recipient_name}`
                                  : 'From Bank Account'
                                }
                              </p>
                              {transaction.recipient_bank_name && (
                                <p className="text-xs text-gray-500">
                                  {transaction.recipient_bank_name}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              {transaction.bridge_transaction_id ? (
                                <p className="font-mono text-gray-600">
                                  {transaction.bridge_transaction_id.slice(0, 12)}...
                                </p>
                              ) : transaction.transaction_hash ? (
                                <p className="font-mono text-gray-600">
                                  {transaction.transaction_hash.slice(0, 8)}...
                                </p>
                              ) : (
                                <p className="text-gray-400">—</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <p className={`font-semibold text-sm ${isPayout ? 'text-orange-600' : 'text-green-600'}`}>
                                {isPayout ? '- ' : '+ '}
                                {formatCurrency(transaction.amount_fiat, transaction.fiat_currency)}
                              </p>
                              <p className="text-xs text-gray-500">
                                ${transaction.amount_usdc?.toFixed(2)} USDC
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.status === 'completed'
                                  ? 'default'
                                  : transaction.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                              className="capitalize"
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your filters or start by making a deposit
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
