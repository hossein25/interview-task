interface Tag {
  id: number;
  name: string;
  name_en: string;
  has_chart: boolean;
}

export interface Currency {
  id: number;
  title: string;
  title_fa: string;
  code: string;
  tradable: boolean;
  for_test?: boolean;
  image: string;
  decimal: number;
  decimal_amount: number;
  decimal_irt: number;
  color: string;
  high_risk: boolean;
  show_high_risk: boolean;
  withdraw_commission: string;
  tags: Tag[];
  etf: boolean;
  for_binvest: boolean;
  for_loan: boolean;
  for_stake: boolean;
  recommend_for_deposit_weight: number;
}

export interface PriceInfo {
  created_at: number | null;
  price: string;
  change: string;
  min: string;
  max: string;
  time: string | null;
  mean: string | null;
  value: string | null;
  amount: string | null;
}

export interface Market {
  id: number;
  currency1: Currency;
  currency2: Currency;
  tradable: boolean;
  otc_tradable: boolean;
  coming_soon: boolean;
  for_test: boolean;
  otc_sell_percent: string;
  otc_buy_percent: string;
  otc_max_buy_amount: string;
  otc_max_sell_amount: string;
  order_book_info: PriceInfo;
  internal_price_info: PriceInfo;
  price_info: PriceInfo;
  price: string;
  title: string;
  code: string;
  title_fa: string;
  trading_view_source: string;
  trading_view_symbol: string;
  otc_market: boolean;
  text: string;
  volume_24h: string;
  market_cap: string;
  circulating_supply: string;
  all_time_high: string;
  popularity_weight: number;
  freshness_weight: number;
  price_increment: string | null;
}

export interface ApiResponse {
  results: Market[];
}

export interface Order {
  amount: string;
  remain: string;
  price: string;
  value: string;
}

export interface OrdersResponse {
  orders: Order[];
  volume: string;
}

export interface Transaction {
  time: number;
  price: string;
  value: string;
  match_amount: string;
  type: "buy" | "sell";
  match_id: string;
}
