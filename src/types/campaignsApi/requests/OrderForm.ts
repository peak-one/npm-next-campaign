import { Attribution } from "../base/Attribution";
import { RequestAddress } from "../base/Address";
import { CartLine } from "../base/CartLine";
import { User } from "../base/User";

interface PaymentDetail {
  card_token?: string | null;
  external_payment_method?: string | null;
  payment_gateway?: number | null;
  payment_gateway_group?: number | null;
  payment_method:
    | "apple_pay"
    | "card_token"
    | "paypal"
    | "klarna"
    | "ideal"
    | "bancontact"
    | "giropay"
    | "google_pay"
    | "sofort"
    | "sepa_debit"
    | "external";
}

export interface OrdersCreateCard {
  attribution?: Attribution;
  billing_address?: RequestAddress;
  billing_same_as_shipping_address?: boolean;
  lines: Array<CartLine>;
  payment_detail: PaymentDetail;
  payment_failed_url?: string;
  shipping_address: RequestAddress;
  shipping_method: number;
  success_url: string;
  use_default_billing_address?: boolean;
  use_default_shipping_address?: boolean;
  user: User;
  vouchers?: Array<string>;
}

export interface OrdersCreatePaypal
  extends Omit<OrdersCreateCard, "shipping_address"> {}

