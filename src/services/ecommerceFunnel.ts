import NextCampaignApi from "../api/nextCampaignApi";
import JustValidate from "just-validate";

interface ICheckoutSelectors {
  address: {
    shipping: {
      first_name: string;
      last_name: string;
      address: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
      phone_number: string;
      notes: string;
    };
    billing: {
      first_name: string;
      last_name: string;
      address: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
      phone_number: string;
      notes: string;
    };
  };
  email: string;
  paymentButton: {
    creditCard: string;
    paypal: string;
    applePay: string;
  };
}

interface NextAddressFields {
  country:  HTMLInputElement | HTMLSelectElement | null;
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

  private addressFields: IAddressFields | null;
  private customerEmailField: HTMLInputElement | null;

  private static DEFAULT_FUNNEL_FIELDS: ICheckoutSelectors = {
    address: {
      shipping: {
        first_name: "[data-first-name]",
        last_name: "[data-last-name]",
        address: "[data-address]",
        city: "[data-city]",
        state: "[data-state]",
        postcode: "[data-zip]",
        country: "[data-country]",
        phone_number: "[data-phone]",
        notes: "[data-notes]",
      },
      billing: {
        first_name: "[data-billing-first-name]",
        last_name: "[data-billing-last-name]",
        address: "[data-billing-address]",
        city: "[data-billing-city]",
        state: "[data-billing-state]",
        postcode: "[data-billing-zip]",
        country: "[data-billing-country]",
        phone_number: "[data-billing-phone]",
        notes: "[data-notes]",
      },
    },
    email: "[data-email]",
    paymentButton: {
      creditCard: "[data-credit-card-btn]",
      paypal: "[data-paypal-btn]",
      applePay: "[data-apple-pay-btn]",
    },
  };

  /**
   * @description Pass the funnel fields and elements to the query selectors
   */
  constructor(
    campaignApi: NextCampaignApi,
    checkoutSelectors: ICheckoutSelectors = EcommerceFunnel.DEFAULT_FUNNEL_FIELDS
  ) {
    this.campaignApi = campaignApi;

    const { shipping } = checkoutSelectors.address;
    const shippingElements = {
      country: document.querySelector(shipping.country) as HTMLInputElement | HTMLSelectElement,
      first_name: document.querySelector(shipping.first_name) as HTMLInputElement,
      last_name: document.querySelector(shipping.last_name) as HTMLInputElement,
      line1: document.querySelector(shipping.address) as HTMLInputElement,
      line2: document.querySelector(shipping.address) as HTMLInputElement,
      line3: document.querySelector(shipping.address) as HTMLInputElement,
      line4: document.querySelector(shipping.city) as HTMLInputElement,
      notes: document.querySelector(shipping.notes) as HTMLInputElement,
      phone_number: document.querySelector(shipping.phone_number) as HTMLInputElement,
      postcode: document.querySelector(shipping.postcode) as HTMLInputElement,
      state: document.querySelector(shipping.state) as HTMLInputElement | HTMLSelectElement,
    }

    const { billing } = checkoutSelectors.address;
    const billingElements = {
      country: document.querySelector(billing.country) as HTMLInputElement | HTMLSelectElement,
      first_name: document.querySelector(billing.first_name) as HTMLInputElement,
      last_name: document.querySelector(billing.last_name) as HTMLInputElement,
      line1: document.querySelector(billing.address) as HTMLInputElement,
      line2: document.querySelector(billing.address) as HTMLInputElement,
      line3: document.querySelector(billing.address) as HTMLInputElement,
      line4: document.querySelector(billing.city) as HTMLInputElement,
      notes: document.querySelector(billing.notes) as HTMLInputElement,
      phone_number: document.querySelector(billing.phone_number) as HTMLInputElement,
      postcode: document.querySelector(billing.postcode) as HTMLInputElement,
      state: document.querySelector(billing.state) as HTMLInputElement | HTMLSelectElement,
    }

    this.addressFields = {
      shipping: shippingElements,
      billing: billingElements,
    };

    this.customerEmailField = document.querySelector(checkoutSelectors.email);

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

    const requiredFields = allPossibleFields.filter((field) => field.required);

    return requiredFields;
  }

  storePageValidFieldsValue() {

  }

  /**
   * @description Validate the present `required` fields  of the page  that match with the ones passed during initialization of this class
   */
  validatePageRequiredFields() {

  }

  createOrder() {
    const validFields = sessionStorage.getItem("validFields");
  }
}

export default EcommerceFunnel;
