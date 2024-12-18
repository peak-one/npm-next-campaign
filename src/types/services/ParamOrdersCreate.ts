import { CartLine } from "../campaignsApi/base/CartLine";

export default interface ParamOrdersCreate {
  shipping_method: number;
  next_page: string;
  vouchers?: Array<string>;
  card_token?: string;
  lines: Array<CartLine>;
}