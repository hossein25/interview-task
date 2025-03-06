import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";

type MarketDetailsErrorProps = {
  error?: string;
};

const MarketDetailsError: FunctionComponent<MarketDetailsErrorProps> = ({
  error,
}) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center text-red-500">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error || "Market not found"}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/")}
        >
          Back to Markets
        </Button>
      </div>
    </div>
  );
};

export default MarketDetailsError;
