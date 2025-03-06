import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatNumber } from "@/lib/_number";
import type { Market } from "@/lib/types";
import Link from "next/link";

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const priceChange =
    typeof market.price_info.change === "string"
      ? Number.parseFloat(market.price_info.change)
      : market.price_info.change;

  return (
    <Link href={`/market/${market.id}`}>
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={market.currency1.image || "/placeholder.svg"}
                alt={market.currency1.title}
                className="h-8 w-8 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder.svg?height=32&width=32";
                }}
              />
              <div>
                <h3 className="font-bold">{market.title}</h3>
                <p className="text-sm text-muted-foreground">{market.code}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">
                {formatNumber(market.price)} {market.currency2.code}
              </p>
              <p
                className={`text-sm ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {priceChange >= 0 ? "+" : ""}
                {priceChange}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="font-medium">
                {formatNumber(market.volume_24h, 0)} {market.currency2.code}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
