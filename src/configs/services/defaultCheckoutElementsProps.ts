import { Rules } from "just-validate";
import { ICheckoutElementProperties } from "../../types/services/checkoutFlow";

const defaultCheckoutElementsProps: ICheckoutElementProperties = {
  pageFieldsForm: {
    selector: "[data-page-form]",
  },
  fields: {
    address: {
      shipping: {
        first_name: {
          selector: "[data-first-name]",
          requireValidation: true,
          validationRules: [  
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 255,
            },
            {
              rule: Rules.CustomRegexp,
              value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
              errorMessage: "Contains an invalid character",
            },
          ],
        },
        last_name: {
          selector: "[data-last-name]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 255,
            },
            {
              rule: Rules.CustomRegexp,
              value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
              errorMessage: "Contains an invalid character",
            },
          ],
        },
        address: {
          selector: "[data-address]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 255,
            },
          ],
        },
        address_line_2: {
          selector: "[data-shipping-address-line-2]",
          requireValidation: false,
        },
        address_line_3: {
          selector: "[data-shipping-address-line-3]",
          requireValidation: false,
        },
        city: {
          selector: "[data-city]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 255,
            },
          ],
        },
        state: {
          selector: "[data-state]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.Required,
            },
          ],
        },
        postcode: {
          selector: "[data-zip]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 64,
            },
          ],
        },
        country: {
          selector: "[data-country]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.Required,
            },
          ],
        },
        phone_number: {
          selector: "[data-phone]",
          requireValidation: false,
        },
        notes: {
          selector: "[data-notes]",
          requireValidation: false,
        },
      },
      billing: {
        first_name: {
          selector: "[data-billing-first-name]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 255,
            },
            {
              rule: Rules.CustomRegexp,
              value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
              errorMessage: "Contains an invalid character",
            },
          ],
        },
        last_name: {
          selector: "[data-billing-last-name]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 255,
            },
            {
              rule: Rules.CustomRegexp,
              value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
              errorMessage: "Contains an invalid character",
            },
          ],
        },
        address: {
          selector: "[data-billing-address]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 255,
            },
          ],
        },
        address_line_2: {
          selector: "[data-billing-address-line-2]",
          requireValidation: false,
        },
        address_line_3: {
          selector: "[data-billing-address-line-3]",
          requireValidation: false,
        },
        city: {
          selector: "[data-billing-city]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 255,
            },
          ],
        },
        state: {
          selector: "[data-billing-state]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
          ],
        },
        postcode: {
          selector: "[data-billing-zip]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MaxLength,
              value: 64,
            },
          ],
        },
        country: {
          selector: "[data-billing-country]",
          requireValidation: true,
          validationRules: [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.Required,
            },
          ],
        },
        phone_number: {
          selector: "[data-billing-phone]",
          requireValidation: false,
        },
        notes: {
          selector: "[data-billing-notes]",
          requireValidation: false,
        },
      },
    },
    email: {
      selector: "[data-email]",
      requireValidation: true,
      validationRules: [
        {
          rule: Rules.Required,
        },
        {
          rule: Rules.Email,
          errorMessage: "Email is invalid!",
        },
        {
          rule: Rules.MaxLength,
          value: 255,
        },
      ],
    },
  },
  checkboxes: {
    billing_same_as_shipping_address: {
      selector: "[data-billing-same-as-shipping-address]",
      defaultValue: true
    },
    use_default_billing_address: {
      selector: "[data-default-billing-address]",
      defaultValue: false
    },
    use_default_shipping_address: {
      selector: "[data-default-shipping-address]",
      defaultValue: false
    },
  },
  paymentMethodsElements: {
    card_token: {
      selector: "[data-payment-method-card]",
    },
    paypal: {
      selector: "[data-payment-method-paypal]",
    }
  },
  selectedItemSelector: "[data-selected]",
};

export default defaultCheckoutElementsProps;
