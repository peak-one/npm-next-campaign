import { FieldRuleInterface } from "just-validate";

interface Selector {
  selector: string;
}

export interface IFieldElementProperties extends Selector {
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

interface CheckboxElement extends Selector {
  defaultValue: boolean;
}

interface Checkout {
  billing_same_as_shipping_address: CheckboxElement,
  use_default_billing_address: CheckboxElement,
  use_default_shipping_address: CheckboxElement,
}

interface PaymentMethods {
  apple_pay?: Selector;
  card_token: Selector;
  paypal?: Selector;
  klarna?: Selector;
  ideal?: Selector;
  bancontact?: Selector;
  giropay?: Selector;
  google_pay?: Selector;
  sofort?: Selector;
  sepa_debit?:Selector;
  external?: Selector;
}

export interface IFunnelElementProperties {
  pageFieldsForm: Selector;
  fields: {
    address: {
      shipping: IAddressElementsProperties;
      billing: IAddressElementsProperties;
    };
    email: IFieldElementProperties;
  };
  checkout: Checkout
  ordersCreateBtn: Selector;
  paymentMethodsElements: PaymentMethods;
}

export interface IFunnelCallbacks {
  onValidationSuccess: Function;
}
