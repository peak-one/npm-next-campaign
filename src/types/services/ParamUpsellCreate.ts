import OrdersUpsellCreate from "../campaignsApi/requests/UpsellForm";

export default interface ParamOrdersCreate extends OrdersUpsellCreate {
  next_page: string;
}
