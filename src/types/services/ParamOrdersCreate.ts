export default interface ParamOrdersCreate {
  shipping_method: number;
  next_page_url: string;
  vouchers?: Array<string>;
}