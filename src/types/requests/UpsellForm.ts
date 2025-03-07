import { CartLine } from "../base/CartLine";

export interface PaymentDetail {
  payment_gateway?: number | null;
  payment_gateway_group?: number | null;
}

export default interface OrdersUpsellCreate {
  lines: Array<Omit<CartLine, "is_upsell">>;
  payment_detail?: PaymentDetail;
}
