import { IUpsellElementProperties } from "../../types/services/upsell";

import defaultCheckoutElementsProps from "./defaultCheckoutElementsProps";

const { selector } = defaultCheckoutElementsProps.selectedItems;

const defaultUpsellElementsProps: IUpsellElementProperties = {
  selectedItems: {
    selector: selector,
  },
  buttons: {
    buy: {
      selector: "[data-buy]",
    },
    noThanks: {
      selector: "[data-no-thanks]",
    }
  },
};

export default defaultUpsellElementsProps;
