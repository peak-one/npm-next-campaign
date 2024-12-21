import { FieldRuleInterface } from "just-validate";

export interface IFieldElementProperties {
  selector: string;
  requireValidation: boolean;
  validationRules?: Array<FieldRuleInterface>;
}

export interface IAddressElementsProperties {
  first_name: IFieldElementProperties;
  last_name: IFieldElementProperties;
  address: IFieldElementProperties;
  address_line_2: IFieldElementProperties;
  address_line_3: IFieldElementProperties;
  city: IFieldElementProperties;
  state: IFieldElementProperties;
  postcode: IFieldElementProperties;
  country: IFieldElementProperties;
  phone_number: IFieldElementProperties;
  notes: IFieldElementProperties;
}

interface CheckboxElement {
  selector: string;
  defaultValue: boolean;
}

interface Checkout {
  billing_same_as_shipping_address: CheckboxElement,
  use_default_billing_address: CheckboxElement,
  use_default_shipping_address: CheckboxElement,
}

export interface IFunnelElementProperties {
  pageFieldsForm: {
    selector: string;
  };
  fields: {
    address: {
      shipping: IAddressElementsProperties;
      billing: IAddressElementsProperties;
    };
    email: IFieldElementProperties;
  };
  checkout: Checkout
  paymentButton: {
    creditCard: string;
    paypal: string;
    applePay: string;
  };
}

export interface IFunnelCallbacks {
  onValidationSuccess: Function;
}
