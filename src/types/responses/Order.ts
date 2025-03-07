import { Attribution } from "../base/Attribution";
import { Address } from "../base/Address";
import { Discount } from "../base/Discount";
import { LinesPackage } from "../base/Package";
import { User } from "../base/User";

export default interface Order {
  attribution: Partial<Attribution>;
  billing_address: Partial<Address>;
  currency: string;
  discounts: Array<Partial<Discount>>;
  display_taxes: string | null;
  is_test: boolean;
  lines: Array<Partial<LinesPackage>>;
  number: string;
  order_status_url: string;
  payment_complete_url: string;
  ref_id: string;
  shipping_address: Partial<Address>;
  shipping_code: string;
  shipping_excl_tax: string;
  shipping_incl_tax: string;
  shipping_method: string;
  shipping_tax: string;
  supports_post_purchase_upsells: boolean;
  total_discounts: string;
  total_excl_tax: string;
  total_incl_tax: string;
  total_tax: string;
  user: Partial<User>;
}
