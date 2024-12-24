import NextCampaignApi from "../api/nextCampaignApi";
import JustValidate from "just-validate";
import _ from "lodash";

import {
  IFunnelElementProperties,
  IFieldElementProperties,
  IFunnelCallbacks,
} from "../types/services/ecommerceFunnel";

import defaultFunnelElementsProps from "../configs/services/defaultFunnelElementsProps";
import ParamOrdersCreate from "../types/services/ParamOrdersCreate";
import ParamUpsellCreate from "../types/services/ParamUpsellCreate";
import RequestOrdersCreate from "../types/campaignsApi/requests/OrderForm";

import getAttributionData from "../utils/getAttributionData";
import Order from "../types/campaignsApi/responses/Order";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

declare global {
  interface Window {
    ordersCreate: (body: ParamOrdersCreate) => Promise<void>;
    upsellCreate: (body: ParamUpsellCreate) => Promise<void>;
  }
}

class EcommerceFunnel {
  private developing: boolean;

  private elementsProperties: IFunnelElementProperties;

  private validator: JustValidate;

  private campaignApi: NextCampaignApi;

  private static DEFAULT_FUNNEL_ELEMENTS_PROPERTIES: IFunnelElementProperties =
    defaultFunnelElementsProps;

  /**
   * @description EcommerceFunnel is used to integrate a funnel with `29next campaigns API` and handle the `form validation`
   * @param campaignApi - An instance of `NextCampaignApi` class to handle the API requests
   * @param elementsCustomProperties - Custom properties to override the default properties of the funnel elements
   */
  constructor(
    campaignApi: NextCampaignApi,
    funnelCallbacks: IFunnelCallbacks,
    elementsCustomProperties: DeepPartial<IFunnelElementProperties> = {},
    showDevLogs: boolean = false
  ) {
    if (window.location.hostname === "localhost" && !showDevLogs) {
      console.log(
        "EcommerceFunnel: Heey dev! If you want to see more logs, set the parameter showDevLogs to true!"
      );
    }
    this.developing = showDevLogs;

    this.campaignApi = campaignApi;

    this.elementsProperties = this.mergeCustomPropertiesWithDefault(
      elementsCustomProperties
    );

    this.validator = new JustValidate(
      this.elementsProperties.pageFieldsForm.selector
    );
    this.validator.onFail((fields) => {
      if (this.developing) {
        console.log(`just-validate onFail fields:`, fields);
      }
    });
    this.validator.onSuccess(() => {
      this.storeInSessionPageValidFieldsValues();
      funnelCallbacks.onValidationSuccess();
    });

    this.setPageRequiredFieldsForValidation();
    this.addActionBillingSameShippingCheckbox();
    
    window.ordersCreate = this.ordersCreate.bind(this);
    window.upsellCreate = this.upsellCreate.bind(this);
  }

  private mergeCustomPropertiesWithDefault(
    customProperties: DeepPartial<IFunnelElementProperties>
  ): IFunnelElementProperties {
    return _.merge(
      {},
      EcommerceFunnel.DEFAULT_FUNNEL_ELEMENTS_PROPERTIES,
      customProperties
    );
  }

  getPageRequiredFieldsProps(): Array<IFieldElementProperties> {
    const { shipping, billing } = this.elementsProperties.fields.address;

    const shippingFieldsProperties = Object.values(shipping);
    
    const pageRequiredFieldsProps = [
      ...shippingFieldsProperties,
      this.elementsProperties.fields.email,
    ];

    if (this.billingSameAsShippingAddress() === false) {
      if (this.developing) {
        console.log(
          `getPageRequiredFieldsProps method: Getting billing fields properties`
        );
      }

      const billingFieldsProperties = Object.values(billing);
      pageRequiredFieldsProps.push(...billingFieldsProperties);
    }

    return pageRequiredFieldsProps;
  }

  private setPageRequiredFieldsForValidation(): void {
    const pageFieldsToValidate = this.getPageRequiredFieldsProps();

    pageFieldsToValidate.forEach((field) => {
      try {
        const fieldIsPresent = document.querySelector(field.selector) !== null;
        if (fieldIsPresent && field.requireValidation) {
          this.validator.addField(field.selector, field.validationRules!);
        } else if (this.developing) {
          console.log(
            `Field selector: ${field.selector} ${
              fieldIsPresent
                ? "has found in the page"
                : "has not found in the page"
            } and the requireValidation value is = ${field.requireValidation}`
          );
        }
      } catch (error) {
        console.error(
          `Error while adding field ${field.selector} to the validator`,
          error
        );
      }
    });
  }

  private addActionBillingSameShippingCheckbox(): void {
    const billSameShipElement = document.querySelector(
      this.elementsProperties.checkout.billing_same_as_shipping_address.selector
    ) as HTMLInputElement;
    if (billSameShipElement) {
      billSameShipElement.addEventListener("change", () => {
        if (this.developing) {
          console.log(
            `billSameShipElement.checked: ${billSameShipElement.checked}`
          );
        }
        if (billSameShipElement.checked === false) {
          sessionStorage.setItem("billing_same_as_shipping_address", "false");
          this.setPageRequiredFieldsForValidation();
        } else {
          sessionStorage.setItem("billing_same_as_shipping_address", "true");
          this.removeBillingFieldsValidation();
        }
      });
    }
  }

  private removeBillingFieldsValidation(): void {
    const { billing } = this.elementsProperties.fields.address;

    const billingFieldsProperties = Object.values(billing);

    billingFieldsProperties.forEach((field) => {
      try {
        const fieldIsPresent = document.querySelector(field.selector) !== null;
        if (fieldIsPresent && field.requireValidation) {
          this.validator.removeField(field.selector);
        }
      } catch (error) {
        console.error(
          `Error while removing field ${field.selector} from the validator`,
          error
        );
      }
    });
  }

  getPageFieldsValues() {
    const $$ = document.querySelector.bind(document);

    const { shipping, billing } = this.elementsProperties.fields.address;

    const pageFieldsValues = {
      shipping: {
        country:
          (
            $$(shipping.country.selector) as
              | HTMLInputElement
              | HTMLSelectElement
          )?.value || undefined,
        first_name:
          ($$(shipping.first_name.selector) as HTMLInputElement)?.value ||
          undefined,
        last_name:
          ($$(shipping.last_name.selector) as HTMLInputElement)?.value ||
          undefined,
        line1:
          ($$(shipping.address.selector) as HTMLInputElement)?.value ||
          undefined,
        line2:
          ($$(shipping.address_line_2.selector) as HTMLInputElement)?.value ||
          undefined,
        line3:
          ($$(shipping.address_line_3.selector) as HTMLInputElement)?.value ||
          undefined,
        line4:
          ($$(shipping.city.selector) as HTMLInputElement)?.value || undefined,
        notes:
          ($$(shipping.notes.selector) as HTMLInputElement)?.value || undefined,
        phone_number:
          ($$(shipping.phone_number.selector) as HTMLInputElement)?.value ||
          undefined,
        postcode:
          ($$(shipping.postcode.selector) as HTMLInputElement)?.value ||
          undefined,
        state:
          ($$(shipping.state.selector) as HTMLInputElement | HTMLSelectElement)
            ?.value || undefined,
      },
      billing: {
        country:
          ($$(billing.country.selector) as HTMLInputElement | HTMLSelectElement)
            ?.value || undefined,
        first_name:
          ($$(billing.first_name.selector) as HTMLInputElement)?.value ||
          undefined,
        last_name:
          ($$(billing.last_name.selector) as HTMLInputElement)?.value ||
          undefined,
        line1:
          ($$(billing.address.selector) as HTMLInputElement)?.value ||
          undefined,
        line2:
          ($$(billing.address_line_2.selector) as HTMLInputElement)?.value ||
          undefined,
        line3:
          ($$(billing.address_line_3.selector) as HTMLInputElement)?.value ||
          undefined,
        line4:
          ($$(billing.city.selector) as HTMLInputElement)?.value || undefined,
        notes:
          ($$(billing.notes.selector) as HTMLInputElement)?.value || undefined,
        phone_number:
          ($$(billing.phone_number.selector) as HTMLInputElement)?.value ||
          undefined,
        postcode:
          ($$(billing.postcode.selector) as HTMLInputElement)?.value ||
          undefined,
        state:
          ($$(billing.state.selector) as HTMLInputElement | HTMLSelectElement)
            ?.value || undefined,
      },
      email:
        ($$(this.elementsProperties.fields.email.selector) as HTMLInputElement)
          ?.value || undefined,
    };

    for (const field in pageFieldsValues.shipping) {
      const key = field as keyof typeof pageFieldsValues.shipping;
      if (pageFieldsValues.shipping[key] === undefined) {
        delete pageFieldsValues.shipping[key];
      }
    }

    for (const field in pageFieldsValues.billing) {
      const key = field as keyof typeof pageFieldsValues.billing;
      if (pageFieldsValues.billing[key] === undefined) {
        delete pageFieldsValues.billing[key];
      }
    }

    if (pageFieldsValues.email === undefined) {
      delete pageFieldsValues.email;
    }

    return pageFieldsValues;
  }

  private storeInSessionPageValidFieldsValues() {
    const storagedFieldsData = sessionStorage.getItem("validFieldsValues");
    let validFieldsValues = storagedFieldsData
      ? JSON.parse(storagedFieldsData)
      : {};

    const pageFieldsValues = this.getPageFieldsValues();

    validFieldsValues = {
      ...validFieldsValues,
      ...pageFieldsValues,

      shipping: {
        ...validFieldsValues.shipping,
        ...pageFieldsValues.shipping,
      },

      billing: {
        ...validFieldsValues.billing,
        ...pageFieldsValues.billing,
      },
    };

    if (this.developing) {
      console.log(
        `storeInSessionPageValidFieldsValues method storaged:`,
        validFieldsValues
      );
    }

    sessionStorage.setItem(
      "validFieldsValues",
      JSON.stringify(validFieldsValues)
    );
  }

  private billingSameAsShippingAddress(): boolean {
    const { selector, defaultValue } =
      this.elementsProperties.checkout.billing_same_as_shipping_address;

    const billSameShipPageValue = (
      document.querySelector(selector) as HTMLInputElement
    )?.checked;

    const billSameShipSessionStoragedValue = JSON.parse(
      sessionStorage.getItem("billing_same_as_shipping_address") || "false"
    );

    const billSameShip =
      billSameShipPageValue ?? billSameShipSessionStoragedValue ?? defaultValue;

    if (this.developing) {
      console.log(
        `billingSameAsShippingAddress method returned: ${billSameShip}`
      );
    }

    return billSameShip;
  }

  // -------------------------------- API methods --------------------------------
  async saveLead(body: any): Promise<void> {
    // NEEDS TO BE IMPLEMENTED
    const result = await this.campaignApi.cartsCreate(body);

    if (this.developing) {
      console.log(`saveLead method result:`, result);
    }
  }

  async ordersCreate(body: ParamOrdersCreate): Promise<void> {
    const $$ = document.querySelector.bind(document);

    const fieldsValues = sessionStorage.getItem("validFieldsValues");
    if (fieldsValues === null) {
      throw new Error(
        "No fields values found in sessionStorage, please call storeInSessionPageValidFieldsValues before calling ordersCreate"
      );
    }
    const { shipping, billing, email } = JSON.parse(fieldsValues);

    const { use_default_billing_address, use_default_shipping_address } =
      this.elementsProperties.checkout;

    const billSameShip = this.billingSameAsShippingAddress();

    const bodyData: RequestOrdersCreate = {
      attribution: getAttributionData(),
      billing_same_as_shipping_address: billSameShip,
      lines: body.lines,
      payment_detail: {
        payment_method: "card_token", 
        card_token: body.card_token,
      },
      // payment_failed_url: body.payment_failed_url,
      shipping_address: shipping,
      shipping_method: body.shipping_method,
      success_url: body.next_page,
      use_default_billing_address:
        ($$(use_default_billing_address.selector) as HTMLInputElement)
          ?.checked ?? use_default_billing_address.defaultValue,
      use_default_shipping_address:
        ($$(use_default_shipping_address.selector) as HTMLInputElement)
          ?.checked ?? use_default_shipping_address.defaultValue,
      user: {
        first_name: shipping.first_name,
        last_name: shipping.last_name,
        email,
        phone_number: shipping.phone_number,
        language: "en",
      },
    };

    if (billSameShip === false) {
      bodyData.billing_same_as_shipping_address = false;
      bodyData.billing_address = billing;
    }

    if (body.vouchers) {
      bodyData.vouchers = body.vouchers;
    }

    if (this.developing) {
      console.log(`ordersCreate method body data:`, bodyData);
    }

    const result = await this.campaignApi.ordersCreate(bodyData);

    if (this.developing) {
      console.log(`ordersCreate method result:`, result);
    }

    if (!result.payment_complete_url && result.number && result.ref_id) {
      sessionStorage.setItem("order_ref_id", result.ref_id);
      sessionStorage.setItem("order_number", result.number);
      window.location.href = body.next_page;
    } else if (result.payment_complete_url) {
      window.location.href = result.payment_complete_url;
    }
  }

  async upsellCreate(body: ParamUpsellCreate): Promise<void> {
    // IS THIS ENOUGHT? COMMENT TO REMIND ME IF THIS IS REALLY ENOUGH (NEED TO TEST)
    const orderRefId = sessionStorage.getItem("order_ref_id");
    if (orderRefId === null) {
      throw new Error(
        "No order reference ID found in sessionStorage, please call ordersCreate before calling upsellCreate"
      );
    }

    const result = await this.campaignApi.ordersUpsellCreate(orderRefId, body);

    if (this.developing) {
      console.log(`upsellCreate result: ${result}`);
    }

    if (result.payment_complete_url) {
      window.location.href = body.next_page;
    }
  }

  async orderRetrieve(orderRefId: string): Promise<Partial<Order>> {
    // IS THIS ENOUGHT? COMMENT TO REMIND ME IF THIS IS REALLY ENOUGH (NEED TO TEST)
    const result = await this.campaignApi.orderRetrieve(orderRefId);

    if (this.developing) {
      console.log(`orderRetrieve result: ${result}`);
    }

    return result;
  }
}

export default EcommerceFunnel;
