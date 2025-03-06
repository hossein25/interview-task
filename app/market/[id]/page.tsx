"use client";

import type React from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading";
import {
  SwipeableTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatNumber } from "@/lib/_number";
import { fetchMarketById, fetchOrders } from "@/lib/api";
import { cn } from "@/lib/cn";
import { BitpinDecimal } from "@/lib/decimal";
import type { Market, OrdersResponse } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import MarketDetailsError from "./components/MarketDetailsError";
import OrdersTable from "./components/OrdersTable";
import TransactionsTab from "./components/TransactionsTab";

enum TabValues {
  BuyOrders = "buy-orders",
  SellOrders = "sell-orders",
  Transactions = "transactions",
}

const TABS = [
  { label: "Buy Orders", value: TabValues.BuyOrders },
  { label: "Sell Orders", value: TabValues.SellOrders },
  { label: "Transactions", value: TabValues.Transactions },
];

export default function MarketDetailsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyOrdersData, setBuyOrdersData] = useState<OrdersResponse>({
    orders: [],
    volume: "0",
  });
  const [sellOrdersData, setSellOrdersData] = useState<OrdersResponse>({
    orders: [],
    volume: "0",
  });

  const [buyPercentage, setBuyPercentage] = useState<string>("10");
  const [sellPercentage, setSellPercentage] = useState<string>("10");
  const [calculatedBuyAmount, setCalculatedBuyAmount] = useState<BitpinDecimal>(
    new BitpinDecimal(0),
  );
  const [calculatedSellAmount, setCalculatedSellAmount] =
    useState<BitpinDecimal>(new BitpinDecimal(0));
  const [totalBuyPayable, setTotalBuyPayable] = useState<BitpinDecimal>(
    new BitpinDecimal(0),
  );
  const [totalSellPayable, setTotalSellPayable] = useState<BitpinDecimal>(
    new BitpinDecimal(0),
  );

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      const [marketData, buyOrdersData, sellOrdersData] = await Promise.all([
        fetchMarketById(id),
        fetchOrders(id, "buy"),
        fetchOrders(id, "sell"),
      ]);

      setMarket(marketData);
      setBuyOrdersData(buyOrdersData);
      setSellOrdersData(sellOrdersData);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch market data. Please try again later.");
      setLoading(false);
      return false;
    }
    return true;
  }, [id]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(async () => {
      const success = await fetchData();
      if (!success) {
        clearInterval(intervalId);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  useEffect(() => {
    if (buyOrdersData.orders.length > 0 && buyPercentage) {
      const totalRemain = buyOrdersData.orders.reduce(
        (sum, order) => sum.plus(new BitpinDecimal(order.remain)),
        new BitpinDecimal(0),
      );
      const percentValue = new BitpinDecimal(buyPercentage).dividedBy(100);
      const amount = totalRemain.times(percentValue);
      setCalculatedBuyAmount(amount);

      const weightedSum = buyOrdersData.orders.reduce(
        (sum, order) =>
          sum.plus(
            new BitpinDecimal(order.price).times(
              new BitpinDecimal(order.remain),
            ),
          ),
        new BitpinDecimal(0),
      );
      const averagePrice = weightedSum.dividedBy(totalRemain);
      setTotalBuyPayable(amount.times(averagePrice));
    }
  }, [buyPercentage, buyOrdersData]);

  useEffect(() => {
    if (sellOrdersData.orders.length > 0 && sellPercentage) {
      const totalRemain = sellOrdersData.orders.reduce(
        (sum, order) => sum.plus(new BitpinDecimal(order.remain)),
        new BitpinDecimal(0),
      );
      const percentValue = new BitpinDecimal(sellPercentage).dividedBy(100);
      const amount = totalRemain.times(percentValue);
      setCalculatedSellAmount(amount);

      const weightedSum = sellOrdersData.orders.reduce(
        (sum, order) =>
          sum.plus(
            new BitpinDecimal(order.price).times(
              new BitpinDecimal(order.remain),
            ),
          ),
        new BitpinDecimal(0),
      );
      const averagePrice = weightedSum.dividedBy(totalRemain);
      setTotalSellPayable(amount.times(averagePrice));
    }
  }, [sellPercentage, sellOrdersData]);

  const handlePercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) && new BitpinDecimal(value).lte(100)) {
      setter(value);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !market) {
    return <MarketDetailsError />;
  }

  const renderOrdersTable = (
    ordersData: OrdersResponse,
    type: "buy" | "sell",
  ) => {
    const orders = ordersData.orders.slice(0, 10);
    const totalRemain = orders.reduce(
      (sum, order) => sum.plus(new BitpinDecimal(order.remain)),
      new BitpinDecimal(0),
    );
    const totalValue = orders.reduce(
      (sum, order) => sum.plus(new BitpinDecimal(order.value)),
      new BitpinDecimal(0),
    );
    const weightedAveragePrice = totalValue.dividedBy(totalRemain);

    return (
      <>
        <OrdersTable orders={orders} />
        <div className="mt-4 space-y-2">
          <p>Total Remain: {formatNumber(totalRemain)}</p>
          <p>Total Value: {formatNumber(totalValue)}</p>
          <p>Weighted Average Price: {formatNumber(weightedAveragePrice)}</p>
          <p>Total Volume: {formatNumber(ordersData.volume)}</p>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Percentage of total {type === "buy" ? "buy" : "sell"} orders:
            </label>
            <Input
              type="text"
              value={type === "buy" ? buyPercentage : sellPercentage}
              onChange={(e) =>
                handlePercentageChange(
                  e,
                  type === "buy" ? setBuyPercentage : setSellPercentage,
                )
              }
              className="w-24"
            />
          </div>
          <div>
            <p>
              Available to {type === "buy" ? "receive" : "sell"}:{" "}
              {formatNumber(
                type === "buy" ? calculatedBuyAmount : calculatedSellAmount,
              )}{" "}
              {market.currency1.code}
            </p>
            <p>
              Average Price: {formatNumber(weightedAveragePrice)}{" "}
              {market.currency2.code}
            </p>
            <p>
              Total Payable:{" "}
              {formatNumber(
                type === "buy" ? totalBuyPayable : totalSellPayable,
              )}{" "}
              {market.currency2.code}
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={16} />
          Back to Markets
        </Button>
        <ThemeToggle />
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">{market.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <img
              src={market.currency1.image || "/placeholder.svg"}
              alt={market.currency1.title}
              className="h-6 w-6 rounded-full"
            />
            <span className="text-lg">
              {market.currency1.title}/{market.currency2.title}
            </span>
          </div>
        </div>

        <Card className="w-full md:w-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(market.price)} {market.currency2.code}
            </div>
            <div
              className={cn(
                "text-sm",
                Number.parseFloat(market.price_info.change) >= 0
                  ? "text-green-500"
                  : "text-red-500",
              )}
            >
              {market.price_info.change}% (24h)
            </div>
          </CardContent>
        </Card>
      </div>

      <SwipeableTabs
        defaultValue={TabValues.BuyOrders}
        tabs={TABS.map((tab) => tab.value)}
      >
        <TabsList className="mb-6">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={TabValues.BuyOrders}>
          <Card>
            <CardHeader>
              <CardTitle>Buy Orders</CardTitle>
            </CardHeader>
            <CardContent>{renderOrdersTable(buyOrdersData, "buy")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={TabValues.SellOrders}>
          <Card>
            <CardHeader>
              <CardTitle>Sell Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {renderOrdersTable(sellOrdersData, "sell")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={TabValues.Transactions}>
          <TransactionsTab />
        </TabsContent>
      </SwipeableTabs>
    </div>
  );
}
