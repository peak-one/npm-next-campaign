import NextCampaignApi from "../api/nextCampaignApi";
import Order from "../types/campaignsApi/responses/Order";

class Thankyou {
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

  async orderRetrieve(orderRefId: string): Promise<Partial<Order>> {
    // IS THIS ENOUGHT? COMMENT TO REMIND ME IF THIS IS REALLY ENOUGH (NEED TO TEST)
    const result = await this.campaignApi.orderRetrieve(orderRefId);

    if (this.developing) {
      console.log(`orderRetrieve result: ${result}`);
    }

    return result;
  }

  removeFunnelSessionStoragedData() {
    const itemsToRemove = [
      "billing_same_as_shipping_address",
      "validFieldsValues",
      "payment_method",
      "order_ref_id",
      "order_number",
      "next_url",
    ];
    itemsToRemove.forEach((item) => {
      sessionStorage.removeItem(item);
    });
  }
}

export default Thankyou;
