import NextCampaignApi from "../api/nextCampaignApi";
import JustValidate from "just-validate";
import intlTelInput from "intl-tel-input";

import {
  mergeCustomPropertiesWithDefault,
  defaultGetAttributionData,
  defaultGetNextUrl,
  defaultGetCartLines,
  defaultGetShippingMethod,
  defaultGetVouchers,
} from "../utils/index.js";

import {
  ICheckoutElementProperties,
  IFieldElementProperties,
  IPhoneElementProperties,
  ordersCreateMethods,
} from "../types/services/checkoutFlow";
import RequestOrdersCreate from "../types/campaignsApi/requests/OrderForm";
import { DeepPartial } from "../types/DeepPartial.js";
declare global {
  interface Window {
    CheckoutFlow: {
      ordersCreate: (card_token: string) => Promise<void>;
    };
    Spreedly: any;
  }
}

import defaultCheckoutElementsProps from "../configs/services/defaultCheckoutElementsProps";

class CheckoutFlow {
  // -------------------------------- CONFIGS --------------------------------
  private developing: boolean;

  private elementsProperties: ICheckoutElementProperties;

  private campaignApi: NextCampaignApi;

  private ordersCreateMethods: ordersCreateMethods;

  private validator: JustValidate;

  /**
   * @description CheckoutFlow is used to integrate a funnel with `29next campaigns API` and handle the `form validation`
   * @param campaignApi - An instance of `NextCampaignApi` class to handle the API requests with a specific campaign
   * @param elementsCustomProperties - Custom properties to overwrite the default properties of the checkout flow elements
   * @param ordersCreateMethods - Custom methods to overwrite the default methods that returns the "lines", "shipping_method" and "vouchers" for the ordersCreate method
   * @param showDevLogs - Enable or disable the logs in the browser console
   */
  constructor(
    campaignApi: NextCampaignApi,
    elementsCustomProperties: DeepPartial<ICheckoutElementProperties> = {},
    ordersCreateMethods: Partial<ordersCreateMethods> = {},
    showDevLogs: boolean = false
  ) {
    if (window.location.hostname === "localhost" && !showDevLogs) {
      console.log(
        "CheckoutFlow: Heey dev! If you want to see more logs, set the parameter showDevLogs to true!"
      );
    }
    this.developing = showDevLogs;

    this.campaignApi = campaignApi;

    this.elementsProperties =
      mergeCustomPropertiesWithDefault<ICheckoutElementProperties>(
        elementsCustomProperties,
        defaultCheckoutElementsProps
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

      const spreedlyCardMachine = window.Spreedly;
      const isCheckoutPage = spreedlyCardMachine !== undefined;
      if (isCheckoutPage) {
        window.CheckoutFlow = { ordersCreate: this.ordersCreate.bind(this) };
        this.switchOrdersCreateMethod();
      } else {
        window.location.href = defaultGetNextUrl();
      }
    });

    this.setPageRequiredFieldsForValidation();
    this.bindActionToBillingSameShippingCheckbox();
    this.bindActionToPaymentMethodElements();

    const { selectedItems } = this.elementsProperties;
    const { getCartLines, getShippingMethod, getVouchers } =
      ordersCreateMethods;
    this.ordersCreateMethods = {
      getCartLines:
        getCartLines ??
        (() => defaultGetCartLines(selectedItems.selector, this.developing)),
      getShippingMethod:
        getShippingMethod ?? (() => defaultGetShippingMethod()),
      getVouchers: getVouchers ?? (() => defaultGetVouchers()),
    };

    sessionStorage.setItem("payment_method", "card_token");
    this.loadIntlTelInput();
  }

  // ----------------------- ADDRESSES FIELDS FUNCTIONS -----------------------

  private async loadIntlTelInput(): Promise<void> {
    const instanciateIntlTelInput = (phoneProps: IPhoneElementProperties) => {
      const phoneElement = document.querySelector(phoneProps.selector);

      if (phoneElement === null) {
        return console.warn(
          `CHECKOUT FLOW WARNING: Element with selector ${phoneProps.selector} not found`
        );
      }

      phoneProps.iti = intlTelInput(phoneElement as HTMLInputElement, {
        // @ts-ignore
        loadUtils: () => import("intl-tel-input/utils"),
        initialCountry: "us",
        strictMode: true,
        onlyCountries: ["us"],
      });
      (phoneElement.parentNode as HTMLElement)!.style.width = "100%";
    };

    instanciateIntlTelInput(
      this.elementsProperties.fields.address.shipping.phone_number
    );
    instanciateIntlTelInput(
      this.elementsProperties.fields.address.billing.phone_number
    );
  }

  private getPageRequiredFieldsProps(): Array<IFieldElementProperties> {
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
          console.warn(
            `CHECKOUT FLOW WARNING: element => ${field.selector} ${
              fieldIsPresent
                ? "has FOUND in the page"
                : "has NOT found in the page"
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

  private bindActionToBillingSameShippingCheckbox(): void {
    const billSameShipElement = document.querySelector(
      this.elementsProperties.checkboxes.billing_same_as_shipping_address
        .selector
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

  private getPageFieldsValues() {
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
        phone_number: shipping.phone_number.iti?.getNumber() || undefined,
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
        phone_number: billing.phone_number.iti?.getNumber() || undefined,
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
      this.elementsProperties.checkboxes.billing_same_as_shipping_address;

    const billSameShipPageValue = (
      document.querySelector(selector) as HTMLInputElement
    )?.checked;

    const billSameShipSessionStoragedValue = JSON.parse(
      sessionStorage.getItem("billing_same_as_shipping_address") || "null"
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

  // ----------------------- PAYMENT METHOD RELATED FUNCTIONS -----------------------

  private bindActionToPaymentMethodElements() {
    const { paymentMethodsElements } = this.elementsProperties;
    for (const paymentMethod in paymentMethodsElements) {
      const key = paymentMethod as keyof typeof paymentMethodsElements;
      if (paymentMethodsElements[key]) {
        const paymentMethodElement = document.querySelector(
          paymentMethodsElements[key].selector
        );
        paymentMethodElement?.addEventListener("click", () => {
          sessionStorage.setItem("payment_method", paymentMethod);
          if (this.developing) {
            console.log(`Payment method selected: ${paymentMethod}`);
          }
        });
      }
    }
  }

  private switchOrdersCreateMethod() {
    const paymentMethod = sessionStorage.getItem("payment_method");
    if (paymentMethod !== null) {
      switch (paymentMethod) {
        case "card_token":
          window.Spreedly.validate();
          break;
        case "paypal":
          this.createPPOrder();
          break;
        default:
          throw new Error(`Payment method ${paymentMethod} is not supported`);
      }
    } else {
      throw new Error("No payment method found in the sessionStorage");
    }
  }

  // ------------------------------ API methods ------------------------------
  async saveLead(body: any): Promise<void> {
    // NEEDS TO BE IMPLEMENTED
    const result = await this.campaignApi.cartsCreate(body);

    if (this.developing) {
      console.log(`saveLead method result:`, result);
    }
  }

  async ordersCreate(card_token: string): Promise<void> {
    const $$ = document.querySelector.bind(document);

    const fieldsValues = sessionStorage.getItem("validFieldsValues");
    if (fieldsValues === null) {
      throw new Error(
        "No fields values found in sessionStorage, please call storeInSessionPageValidFieldsValues before calling ordersCreate"
      );
    }
    const { shipping, billing, email } = JSON.parse(fieldsValues);

    const { use_default_billing_address, use_default_shipping_address } =
      this.elementsProperties.checkboxes;

    const billSameShip = this.billingSameAsShippingAddress();
    const nextUrl = defaultGetNextUrl();

    const bodyData: RequestOrdersCreate = {
      attribution: defaultGetAttributionData(),
      billing_same_as_shipping_address: billSameShip,
      lines: this.ordersCreateMethods.getCartLines(),
      payment_detail: {
        payment_method: "card_token",
        card_token: card_token,
      },
      // payment_failed_url: body.payment_failed_url,
      shipping_address: shipping,
      shipping_method: this.ordersCreateMethods.getShippingMethod(),
      success_url: nextUrl,
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
        phone_number: shipping.phone_number.iti?.getNumber(),
        language: "en",
      },
    };

    if (billSameShip === false) {
      bodyData.billing_same_as_shipping_address = false;
      bodyData.billing_address = billing;
    }

    const vouchers = this.ordersCreateMethods.getVouchers();
    if (vouchers.length > 0) {
      bodyData.vouchers = vouchers;
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
      window.location.href = nextUrl;
    } else if (result.payment_complete_url) {
      window.location.href = result.payment_complete_url;
    }
  }

  async createPPOrder(): Promise<void> {
    // NEEDS TO BE IMPLEMENTED
  }
}

export default CheckoutFlow;
