import NextCampaignApi from "../api/nextCampaignApi";
import _ from "lodash";
import JustValidate from "just-validate";

import {
  IFunnelElementProperties,
  IFieldElementProperties,
} from "../types/services/ecommerceFunnel";

import defaultFunnelElementsProps from "../configs/services/defaultFunnelElementsProps";
import ParamOrdersCreate from "../types/services/ParamOrdersCreate";
import RequestOrdersCreate from "../types/campaignsApi/requests/OrderForm";

import getAttributionData from "../utils/getAttributionData";
import getNextUrlKeepingSubPath from "../utils/getNextUrlKeepingSubPath";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

class EcommerceFunnel {
  private developing = window.location.hostname === "localhost";

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
    elementsCustomProperties: DeepPartial<IFunnelElementProperties> = {}
  ) {
    this.campaignApi = campaignApi;

    this.elementsProperties = this.mergeCustomPropertiesWithDefault(
      elementsCustomProperties
    );

    this.validator = new JustValidate(
      this.elementsProperties.pageFieldsForm.selector
    );
    this.validator.onFail((fields) => {
      if (this.developing) {
        console.log(`just-validate onFail fields: ${fields}`);
      }
    });
    this.validator.onSuccess(() => {
      this.storeInSessionPageValidFieldsValues();
    });

    this.setPageRequiredFieldsForValidation();
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
    const billingFieldsProperties = Object.values(billing);

    return [
      ...shippingFieldsProperties,
      ...billingFieldsProperties,
      this.elementsProperties.fields.email,
    ];
  }

  private setPageRequiredFieldsForValidation(): void {
    const pageFieldsToValidate = this.getPageRequiredFieldsProps();

    pageFieldsToValidate.forEach((field) => {
      try {
        if (
          document.querySelector(field.selector) !== null &&
          field.requireValidation
        ) {
          this.validator.addField(field.selector, field.validationRules!);
        }
      } catch (error) {
        console.error(
          `Error while adding field ${field.selector} to the validator`,
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
    let validFieldsValues = {};

    if (storagedFieldsData) {
      validFieldsValues = storagedFieldsData
        ? JSON.parse(storagedFieldsData)
        : {};
    }

    validFieldsValues = { ...validFieldsValues, ...this.getPageFieldsValues() };

    sessionStorage.setItem(
      "validFieldsValues",
      JSON.stringify(validFieldsValues)
    );
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

    const {
      billing_same_as_shipping_address,
      use_default_billing_address,
      use_default_shipping_address,
    } = this.elementsProperties.checkout;

    const bodyData: RequestOrdersCreate = {
      attribution: getAttributionData(),
      billing_same_as_shipping_address:
        ($$(billing_same_as_shipping_address.selector) as HTMLInputElement)
          ?.checked || billing_same_as_shipping_address.defaultValue,
      lines: body.lines,
      payment_detail: {
        payment_method: "card_token",
        card_token: body.card_token,
      },
      // payment_failed_url: body.payment_failed_url,
      shipping_address: shipping,
      shipping_method: body.shipping_method,
      success_url: getNextUrlKeepingSubPath(body.next_page_url),
      use_default_billing_address:
        ($$(use_default_billing_address.selector) as HTMLInputElement)
          ?.checked || use_default_billing_address.defaultValue,
      use_default_shipping_address:
        ($$(use_default_shipping_address.selector) as HTMLInputElement)
          ?.checked || use_default_shipping_address.defaultValue,
      user: {
        first_name: shipping.first_name,
        last_name: shipping.last_name,
        email,
        phone_number: shipping.phone_number,
        language: "en",
      },
    };

    if (billing) {
      bodyData.billing_same_as_shipping_address = false;
      bodyData.billing_address = billing;
    }

    if (body.vouchers) {
      bodyData.vouchers = body.vouchers;
    }

    const result = await this.campaignApi.ordersCreate(bodyData);

    if (this.developing) {
      console.log(`ordersCreate result: ${result}`);
    }

    if (!result.payment_complete_url && result.number && result.ref_id) {
      sessionStorage.setItem("order_ref_id", result.ref_id);
      sessionStorage.setItem("order_number", result.number);
      window.location.href = getNextUrlKeepingSubPath(body.next_page_url);
    } else if (result.payment_complete_url) {
      window.location.href = result.payment_complete_url;
    }
  }
}

export default EcommerceFunnel;
