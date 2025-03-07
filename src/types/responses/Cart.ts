import { Attribution } from "../base/Attribution";
import { Discount } from "../base/Discount";
import { LinesPackage } from "../base/Package";
import { User } from "../base/User";

export default interface Cart {
  attribution: Partial<Attribution>;
  checkout_url: string;
  currency: string;
  discounts: Array<Partial<Discount>>;
  display_taxes: string | null;
  is_test: boolean;
  lines: Array<Partial<LinesPackage>>;
  total_discounts: string;
  total_excl_tax: string;
  total_excl_tax_excl_discounts: string;
  total_incl_tax: string;
  total_incl_tax_excl_discounts: string;
  user: Partial<User>;
}
