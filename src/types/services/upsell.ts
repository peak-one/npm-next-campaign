import { CartLine } from "../base/CartLine";

interface Selector {
  selector: string;
}

export interface IUpsellElementProperties {
  selectedItems: Selector;
  buttons: {
    buy: Selector;
    noThanks: Selector;
  };
}

export interface upsellCreateMethods {
  getUpsellLines: (...args: any[]) => Array<Omit<CartLine, "is_upsell">>;
}
