import CartForm from "../types/requests/CartForm";
import { OrdersCreateCard, OrdersCreatePaypal } from "../types/requests/OrderForm";
import UpsellForm from "../types/requests/UpsellForm";
import Campaign from "../types/responses/Campaign";
import Cart from "../types/responses/Cart";
import Order from "../types/responses/Order";

class NextCampaignApi {
  private baseUrl: string;
  private headers: {
    "Content-Type": string;
    Authorization: string;
  };

  /**
   * @description 29Next Campaigns API and the endpoints.
   * @param {string} campaignApiKey - `API Key of the 29Next` created campaign.
   * @param {string} [baseUrl="https://campaigns.apps.29next.com/api/v1"] - *Optional*, campaign API URL.
   */
  constructor(
    campaignApiKey: string,
    baseUrl: string = "https://campaigns.apps.29next.com/api/v1"
  ) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: campaignApiKey,
    };
  }

  private async get(endPoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${endPoint}/`, {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`GET request to endpoint ${endPoint} failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in GET request to endpoint ${endPoint}:`, error);
      throw error;
    }
  }

  private async post(
    endPoint: string,
    data: Record<string, any>
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${endPoint}/`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`POST request to endpoint ${endPoint} failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in POST request to endpoint ${endPoint}:`, error);
      throw error;
    }
  }

  /**
   * @description Retrieve campaign details of the campaigns found in 29next campaigns like:
   * "https://t1b.29next.store/dashboard/apps/campaigns/s/campaigns/settings/302/"
   */
  async campaignRetrieve(): Promise<Partial<Campaign>> {
    return await this.get("campaigns");
  }

  /**
   * @description Used to save a potencial customer data `(lead)` since it creates an open cart with some products inside before the creation of the order itself.
   */
  async cartsCreate(body: CartForm): Promise<Partial<Cart>> {
    return await this.post("carts", body);
  }

  async ordersCreate(body: OrdersCreateCard | OrdersCreatePaypal): Promise<Partial<Order>> {
    return await this.post("orders", body);
  }

  /**
   * @description Create an upsell order with given order reference ID `ref_id`.
   * @param {string} orderRefId - Order reference ID is the `ref_id` that comes from the response of the ordersCreate.
   */
  async ordersUpsellCreate(
    orderRefId: string,
    body: UpsellForm
  ): Promise<Partial<Order>> {
    return await this.post(`orders/${orderRefId}/upsells`, body);
  }

  /**
   * @description Retrieves an order by a given order reference ID `ref_id`.
   * @param {string} orderRefId - Order reference ID is the `ref_id` that comes from the response of the ordersCreate.
   */
  async orderRetrieve(orderRefId: string): Promise<Partial<Order>> {
    return await this.get(`orders/${orderRefId}`);
  }
}

export default NextCampaignApi;
