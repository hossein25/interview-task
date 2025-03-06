import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/_date";
import { formatNumber } from "@/lib/_number";
import { fetchTransactions } from "@/lib/api";

import { cn } from "@/lib/cn";
import { Transaction } from "@/lib/types";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import MarketDetailsError from "./MarketDetailsError";

export default function TransactionsTab() {
  const { id } = useParams<{ id: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      const transactionsData = await fetchTransactions(id);

      setTransactions(transactionsData.slice(0, 10));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch market data. Please try again later.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <MarketDetailsError />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.match_id}>
                <TableCell>{formatNumber(transaction.match_amount)}</TableCell>
                <TableCell>{formatNumber(transaction.price)}</TableCell>
                <TableCell>{formatDate(transaction.time)}</TableCell>
                <TableCell
                  className={cn({
                    "text-green-500": transaction.type === "buy",
                    "text-red-500": transaction.type === "sell",
                  })}
                >
                  {transaction.type.toUpperCase()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
