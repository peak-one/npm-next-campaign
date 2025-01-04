import NextCampaignApi from "../api/nextCampaignApi";
import _ from "lodash";
import {
  defaultGetNextUrl,
  defaultGetCartLines,
  mergeCustomPropertiesWithDefault,
} from "../utils/index.js";

import {
  IUpsellElementProperties,
  upsellCreateMethods,
} from "../types/services/upsell";
declare global {
  interface Window {
    upsellCreate: () => Promise<void>;
  }
}

import defaultUpsellElementsProps from "../configs/services/defaultUpsellElementsProps";

class Upsell {
  private developing: boolean;

  private elementsProperties: IUpsellElementProperties;

  private campaignApi: NextCampaignApi;

  private upsellCreateMethods: upsellCreateMethods;

  constructor(
    campaignApi: NextCampaignApi,
    elementsCustomProperties: Partial<IUpsellElementProperties> = {},
    upsellCreateMethods: Partial<upsellCreateMethods> = {},
    showDevLogs: boolean = false
  ) {
    if (window.location.hostname === "localhost" && !showDevLogs) {
      console.log(
        "Upsell: Heey dev! If you want to see more logs, set the parameter showDevLogs to true!"
      );
    }
    this.developing = showDevLogs;

    this.campaignApi = campaignApi;

    this.elementsProperties =
      mergeCustomPropertiesWithDefault<IUpsellElementProperties>(
        elementsCustomProperties,
        defaultUpsellElementsProps
      );
    if (this.developing) {
      console.log("Upsell: elementsProperties: ", this.elementsProperties);
    }

    const { selectedItems } = this.elementsProperties;
    const { getUpsellLines } = upsellCreateMethods;
    this.upsellCreateMethods = {
      getUpsellLines:
        getUpsellLines ??
        (() => defaultGetCartLines(selectedItems.selector, this.developing)),
    };

    this.bindActionToBuyButton();
    this.bindActionToNoThanksButton();

    window.upsellCreate = this.upsellCreate.bind(this);
  }

  private bindActionToBuyButton(): void {
    const { buy } = this.elementsProperties.buttons;
    const buyButtons = document.querySelectorAll(buy.selector);
    if (buyButtons.length === 0) {
      throw new Error(
        `Upsell: Buy button(s) not found with selector ${buy.selector}`
      );
    }

    buyButtons.forEach((buyButton) => {
      buyButton.addEventListener("click", async () => {
        await this.upsellCreate();
      });
    });
  }

  private bindActionToNoThanksButton(): void {
    const { noThanks } = this.elementsProperties.buttons;
    const noThanksButtons = document.querySelectorAll(noThanks.selector);
    if (noThanksButtons.length === 0) {
      throw new Error(
        `Upsell: No thanks button(s) not found with selector ${noThanks.selector}`
      );
    }

    noThanksButtons.forEach((noThanksButton) => {
      noThanksButton.addEventListener("click", async () => {
        window.location.href = defaultGetNextUrl();
      });
    });
  }

  async upsellCreate(): Promise<void> {
    const orderRefId = sessionStorage.getItem("order_ref_id");
    if (orderRefId === null) {
      throw new Error(
        "Upsell: No order reference ID (ref_id) found in sessionStorage, please call ordersCreate before calling upsellCreate"
      );
    }

    const body = { lines: this.upsellCreateMethods.getUpsellLines() };

    const result = await this.campaignApi.ordersUpsellCreate(orderRefId, body);

    if (this.developing) {
      console.log(`Upsell: upsellCreate result ${result}`);
    }

    if (result.number) {
      window.location.href = defaultGetNextUrl();
    }
  }
}

export default Upsell;
