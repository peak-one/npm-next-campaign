interface CampaignPackage {
  ref_id: number;
  name: string;
  external_id: number;
  qty: number;
  price: string;
  price_total: string;
  price_retail: string;
  price_retail_total: string;
  is_recurring: boolean;
  price_recurring: string;
  price_recurring_total: string;
  interval: "day" | "month";
  interval_count: number;
  image: string;
}

export default interface Campaign {
  name: string;
  currency: string;
  language: string;
  payment_env_key: string;
  packages: Array<Partial<CampaignPackage>>;
  shipping_methods: Array<
    Partial<{
      ref_id: number;
      code: string;
      price: string;
    }>
  >;
}
