// third script that should be initialized after checkout.ts
import CheckoutFlow from "../services/checkoutFlow";
import campaign from "./campaign";

const checkoutFlowElementsProperties = {
  selectedItems: {
    selector: ".active",
  },
};

new CheckoutFlow(campaign, checkoutFlowElementsProperties, {}, true);
