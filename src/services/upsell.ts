import NextCampaignApi from "../api/nextCampaignApi";
import { CartLine } from "../types/campaignsApi/base/CartLine";
import getNextUrl from "../utils/getNextUrl";

declare global {
  interface Window {
    upsellCreate: () => Promise<void>;
  }
}

class Upsell {
  private developing: boolean;

  private campaignApi: NextCampaignApi;

  constructor(campaignApi: NextCampaignApi, showDevLogs: boolean = false) {
    if (window.location.hostname === "localhost" && !showDevLogs) {
      console.log(
        "CheckoutFlow: Heey dev! If you want to see more logs, set the parameter showDevLogs to true!"
      );
    }
    this.developing = showDevLogs;

    this.campaignApi = campaignApi;
  }

  private getUpsellLines(): Array<Omit<CartLine, "is_upsell">> {
    return [] as Array<Omit<CartLine, "is_upsell">>;
  }

  async upsellCreate(): Promise<void> {
    // IS THIS ENOUGHT? COMMENT TO REMIND ME IF THIS IS REALLY ENOUGH (NEED TO TEST)
    const orderRefId = sessionStorage.getItem("order_ref_id");
    if (orderRefId === null) {
      throw new Error(
        "No order reference ID (ref_id) found in sessionStorage, please call ordersCreate before calling upsellCreate"
      );
    }

    const body = { lines: this.getUpsellLines() };

    const result = await this.campaignApi.ordersUpsellCreate(orderRefId, body);

    if (this.developing) {
      console.log(`upsellCreate result: ${result}`);
    }

    if (result.payment_complete_url) {
      window.location.href = getNextUrl();
    }
  }
}

export default Upsell;
