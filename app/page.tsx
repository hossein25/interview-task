"use client";

import { MarketSection } from "@/components/market-section";
import { ThemeToggle } from "@/components/theme-toggle";
import LoadingSpinner from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchMarkets } from "@/lib/api";
import type { Market } from "@/lib/types";
import { useEffect, useState } from "react";

enum MARKET_TYPES {
  IRT = "IRT",
  USDT = "USDT",
}

const TABS = [
  { label: "Toman Market", value: MARKET_TYPES.IRT },
  { label: "Tether Market", value: MARKET_TYPES.USDT },
];

type PaginationState = Record<MARKET_TYPES, number>;

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationState, setPaginationState] = useState<PaginationState>(() =>
    Object.values(MARKET_TYPES).reduce(
      (acc, currencyCode) => ({ ...acc, [currencyCode]: 1 }),
      {} as PaginationState,
    ),
  );

  useEffect(() => {
    const getMarkets = async () => {
      try {
        setLoading(true);
        const data = await fetchMarkets();

        setMarkets(data);
        setLoading(false);
      } catch (err) {
        console.error("Error in component:", err);
        setError("Failed to fetch markets. Using fallback data.");
        setLoading(false);
      }
    };

    getMarkets();
  }, []);

  const handlePageChange = (currencyCode: MARKET_TYPES, page: number) => {
    setPaginationState((prev) => ({
      ...prev,
      [currencyCode]: page,
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Percentage Order Book</h1>
        <ThemeToggle />
      </div>

      <Tabs defaultValue={TABS[0].value}>
        <TabsList className="mb-6">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={`pagination-${tab.value}`} value={tab.value}>
            <MarketSection
              markets={markets}
              currencyCode={tab.value}
              currentPage={paginationState[tab.value]}
              onPageChange={(page) => handlePageChange(tab.value, page)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
