import type { ApiResponse, Market, Order, Transaction } from "./types";

export async function fetchMarkets(): Promise<Market[]> {
  try {
    const response = await fetch("/api/markets", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data.results;
  } catch (error) {
    throw new Error(`API faced error: ${error}`);
  }
}

export async function fetchMarketById(id: string): Promise<Market> {
  try {
    const markets = await fetchMarkets();
    const market = markets.find((m) => m.id.toString() === id);

    if (!market) {
      throw new Error(`Market with ID ${id} not found`);
    }

    return market;
  } catch (error) {
    console.error(`Error fetching market with ID ${id}:`, error);
    throw error;
  }
}

export async function fetchOrders(
  marketId: string,
  type: "buy" | "sell",
): Promise<{ orders: Order[]; volume: string }> {
  try {
    const response = await fetch(`/api/orders/${marketId}/?type=${type}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching ${type} orders:`, error);
    return { orders: [], volume: "" };
  }
}

export async function fetchTransactions(
  marketId: string,
): Promise<Transaction[]> {
  try {
    const response = await fetch(`/api/matches/?marketId=${marketId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
