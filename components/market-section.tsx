import MarketCard from "@/components/market-card";
import { Pagination } from "@/components/ui/pagination";
import { Market } from "@/lib/types";

interface MarketSectionProps {
  markets: Market[];
  currencyCode: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function MarketSection({
  markets,
  currencyCode,
  currentPage,
  onPageChange,
}: MarketSectionProps) {
  const itemsPerPage = 10;

  const filteredMarkets = markets.filter(
    (market) => market.currency2.code === currencyCode,
  );

  const totalPages = Math.ceil(filteredMarkets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMarkets = filteredMarkets.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
