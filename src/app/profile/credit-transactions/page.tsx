"use client";

import { serverURL } from "@/utils/utils";
import { useState, useEffect } from "react";
import Link from "next/link";

interface CreditTransaction {
  _id: string;
  userId: { name: string; email: string };
  type: string;
  amount: number;
  purchaseId?: { transactionId: string; amount: number; currency: string; expirationDate: string };
  creditId: { balance: number; createdAt: string; updatedAt: string };
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const TransactionCard = ({ transaction }: { transaction: CreditTransaction }) => (
  <li className="p-6 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700/50 transition-all duration-300 shadow-lg">
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium">
          {transaction.type}
        </span>
        <span className="text-lg font-semibold text-green-400">
          {transaction.amount} credits
        </span>
      </div>
      <div className="mt-2 text-gray-300">
        <p className="text-sm">
          <span className="font-medium">User:</span> {transaction.userId.name}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-medium">Email:</span> {transaction.userId.email}
        </p>
      </div>

    </div>
  </li>
);

const TransactionSummary = ({ sums }: { sums: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    {Object.entries(sums).map(([key, value]) => (
      <div key={key} className="p-4 bg-gray-800 rounded-lg shadow-lg">
        <h4 className="text-gray-400 text-sm mb-1">
          {key.replace('credit', '').trim()}
        </h4>
        <p className="text-2xl font-bold text-white">{value as number}</p>
      </div>
    ))}
  </div>
);

const CreditTransactionsPage = () => {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [expiredTransactions, setExpiredTransactions] = useState<CreditTransaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [transactionSums, setTransactionSums] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverURL}/users/credit-transactions?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      
      if (!res.ok) throw new Error("Failed to fetch credit transactions");

      const data = await res.json();
      setTransactions(data.transactions);
      setPagination(data.pagination);
      setTransactionSums(data.transactionSums);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiredTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverURL}/users/expired-transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setExpiredTransactions(data.expiredTransactions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchExpiredTransactions();
  }, []);

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/profile" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <span className="mr-2">←</span> Back to Profile
        </Link>

        <h1 className="text-4xl font-bold mb-8">Credit Transactions</h1>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <>
            <TransactionSummary sums={transactionSums} />

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-6">Recent Transactions</h2>
                <ul className="space-y-4">
                  {transactions.map((txn) => (
                    <TransactionCard key={txn._id} transaction={txn} />
                  ))}
                </ul>

                {pagination && (
                  <div className="mt-8 flex justify-between items-center">
                    <div className="flex gap-4">
                      <button
                        className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        onClick={() => fetchTransactions(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                      >
                        Previous
                      </button>
                      <button
                        className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        onClick={() => fetchTransactions(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        Next
                      </button>
                    </div>
                    <p className="text-gray-400">
                      Page {pagination.page} of {pagination.totalPages}
                    </p>
                  </div>
                )}
              </section>

              {expiredTransactions.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-2xl font-semibold mb-6">Expired Transactions</h2>
                  <ul className="space-y-4">
                    {expiredTransactions.map((txn) => (
                      <TransactionCard key={txn._id} transaction={txn} />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </>
        )}

        {!loading && transactions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditTransactionsPage;
