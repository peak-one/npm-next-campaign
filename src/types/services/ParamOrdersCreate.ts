import { CartLine } from "../campaignsApi/base/CartLine";

export default interface ParamOrdersCreate {
  shipping_method: number;
  next_page_url: string;
  vouchers?: Array<string>;
  card_token?: string;
  lines: Array<CartLine>;
}