import NextCampaignApi from "../api/nextCampaignApi";
import _ from "lodash";
import JustValidate from "just-validate";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

interface FieldElementProperties {
  selector: string;
  errorMessage: string;
}

interface IAddressElementsProperties {
  first_name: FieldElementProperties;
  last_name: FieldElementProperties;
  address: FieldElementProperties;
  city: FieldElementProperties;
  state: FieldElementProperties;
  postcode: FieldElementProperties;
  country: FieldElementProperties;
  phone_number: FieldElementProperties;
  notes: FieldElementProperties;
}

interface IFunnelElementProperties {
  address: {
    shipping: IAddressElementsProperties;
    billing: IAddressElementsProperties;
  };
  email: FieldElementProperties;
  paymentButton: {
    creditCard: string;
    paypal: string;
    applePay: string;
  };
}

interface NextAddressFields {
  country: HTMLInputElement | HTMLSelectElement | null;
  first_name: HTMLInputElement | null;
  last_name: HTMLInputElement | null;
  line1: HTMLInputElement | null;
  line2: HTMLInputElement | null;
  line3: HTMLInputElement | null;
  line4: HTMLInputElement | null;
  notes: HTMLInputElement | null;
  phone_number: HTMLInputElement | null;
  postcode: HTMLInputElement | null;
  state: HTMLInputElement | HTMLSelectElement | null;
}

interface IAddressFields {
  shipping: NextAddressFields;
  billing: NextAddressFields;
}

class EcommerceFunnel {
  private campaignApi: NextCampaignApi;

  private elementsProperties: IFunnelElementProperties;

  private addressFields: IAddressFields | null;
  private customerEmailField: HTMLInputElement | null;

  private static DEFAULT_FUNNEL_ELEMENTS_PROPERTIES: IFunnelElementProperties =
    {
      address: {
        shipping: {
          first_name: {
            selector: "[data-first-name]",
            errorMessage: "Invalid shipping first name",
          },
          last_name: {
            selector: "[data-last-name]",
            errorMessage: "Invalid shipping last name",
          },
          address: {
            selector: "[data-address]",
            errorMessage: "Invalid shipping address",
          },
          city: {
            selector: "[data-city]",
            errorMessage: "Invalid shipping city",
          },
          state: {
            selector: "[data-state]",
            errorMessage: "Invalid shipping state",
          },
          postcode: {
            selector: "[data-zip]",
            errorMessage: "Invalid shipping zip",
          },
          country: {
            selector: "[data-country]",
            errorMessage: "Invalid shipping country",
          },
          phone_number: {
            selector: "[data-phone]",
            errorMessage: "Invalid shipping phone",
          },
          notes: {
            selector: "[data-notes]",
            errorMessage: "Invalid shipping notes",
          },
        },
        billing: {
          first_name: {
            selector: "[data-billing-first-name]",
            errorMessage: "Invalid shipping first name",
          },
          last_name: {
            selector: "[data-billing-last-name]",
            errorMessage: "Invalid shipping last name",
          },
          address: {
            selector: "[data-billing-address]",
            errorMessage: "Invalid shipping address",
          },
          city: {
            selector: "[data-billing-city]",
            errorMessage: "Invalid shipping city",
          },
          state: {
            selector: "[data-billing-state]",
            errorMessage: "Invalid shipping state",
          },
          postcode: {
            selector: "[data-billing-zip]",
            errorMessage: "Invalid shipping zip",
          },
          country: {
            selector: "[data-billing-country]",
            errorMessage: "Invalid shipping country",
          },
          phone_number: {
            selector: "[data-billing-phone]",
            errorMessage: "Invalid shipping phone",
          },
          notes: {
            selector: "[data-billing-notes]",
            errorMessage: "Invalid shipping notes",
          },
        },
      },
      email: {
        selector: "[data-email]",
        errorMessage: "Invalid email",
      },
      paymentButton: {
        creditCard: "[data-credit-card-btn]",
        paypal: "[data-paypal-btn]",
        applePay: "[data-apple-pay-btn]",
      },
    };

  /**
   * @description Pass query selectors of the funnel fields and the fields validation
   */
  constructor(
    campaignApi: NextCampaignApi,
    elementsCustomProperties: DeepPartial<IFunnelElementProperties> = {}
  ) {
    this.campaignApi = campaignApi;

    this.elementsProperties = this.mergeCustomPropertiesWithDefault(
      elementsCustomProperties
    );

    const { shipping, billing } = this.elementsProperties.address;
    this.addressFields = {
      shipping: this.getPageFields(shipping),
      billing: this.getPageFields(billing),
    };

    this.customerEmailField = document.querySelector(
      this.elementsProperties.email.selector
    );
  }

  getPageFields(
    fields: IAddressElementsProperties
  ): NextAddressFields {
    const $$ = document.querySelector.bind(document);

    return {
      country: $$(fields.country.selector) as
        | HTMLInputElement
        | HTMLSelectElement,
      first_name: $$(fields.first_name.selector) as HTMLInputElement,
      last_name: $$(fields.last_name.selector) as HTMLInputElement,
      line1: $$(fields.address.selector) as HTMLInputElement,
      line2: $$(fields.address.selector) as HTMLInputElement,
      line3: $$(fields.address.selector) as HTMLInputElement,
      line4: $$(fields.city.selector) as HTMLInputElement,
      notes: $$(fields.notes.selector) as HTMLInputElement,
      phone_number: $$(fields.phone_number.selector) as HTMLInputElement,
      postcode: $$(fields.postcode.selector) as HTMLInputElement,
      state: $$(fields.state.selector) as HTMLInputElement | HTMLSelectElement,
    };
  }

  mergeCustomPropertiesWithDefault(
    customProperties: DeepPartial<IFunnelElementProperties>
  ): IFunnelElementProperties {
    return _.merge({}, EcommerceFunnel.DEFAULT_FUNNEL_ELEMENTS_PROPERTIES, customProperties);
  }

  private initializeSaveLeadEventListeners() {
    if (
      this.addressFields &&
      this.customerEmailField &&
      this.addressFields.shipping.first_name &&
      this.addressFields.shipping.last_name &&
      this.addressFields.shipping.phone_number
    ) {
    }
  }

  getPageRequiredFields(): Array<HTMLInputElement | HTMLSelectElement> {
    const allPossibleFields = [];

    if (this.addressFields) {
      const shippingFields = Object.values(this.addressFields.shipping);
      const billingFields = Object.values(this.addressFields.billing);
      allPossibleFields.push(...shippingFields, ...billingFields);
    }

    if (this.customerEmailField) {
      allPossibleFields.push(this.customerEmailField);
    }

    const requiredFields = allPossibleFields.filter((field) => {
      if (field !== null) {
        return field.required;
      }
    });

    return requiredFields;
  }

  storePageValidFieldsValue() {}

  /**
   * @description Validate the present `required` fields of the page that match with the ones passed during initialization of this class
   */
  validatePageRequiredFields() {}

  createOrder() {
    const validFields = sessionStorage.getItem("validFields");
  }
}

export default EcommerceFunnel;
