import { FieldRuleInterface } from "just-validate";
import { CartLine } from "../base/CartLine";
import { Iti } from "intl-tel-input";
import { Attribution } from "../base/Attribution";

interface Selector {
  selector: string;
}

export interface IFieldElementProperties extends Selector {
  requireValidation: boolean;
  validationRules?: Array<FieldRuleInterface>;
}

export interface IPhoneElementProperties extends Selector {
  iti: Iti | undefined;
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
  phone_number: IPhoneElementProperties;
  notes: IFieldElementProperties;
}

interface CheckboxElement extends Selector {
  defaultValue: boolean;
}

interface Checkboxes {
  billing_same_as_shipping_address: CheckboxElement,
  use_default_billing_address: CheckboxElement,
  use_default_shipping_address: CheckboxElement,
  fast_shipping: CheckboxElement,
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

export interface ICheckoutElementProperties {
  pageFieldsForm: Selector;
  fields: {
    address: {
      shipping: IAddressElementsProperties;
      billing: IAddressElementsProperties;
    };
    email: IFieldElementProperties;
  };
  checkboxes: Checkboxes
  paymentMethodsElements: PaymentMethods;
  selectedItems: Selector;
}

export interface ordersCreateMethods {
  getAttributionData: (...args: any[]) => Attribution;
  getCartLines: (...args: any[]) => Array<CartLine>;
  getShippingMethod: (...args: any[]) => number;
  getVouchers: (...args: any[]) => Array<string>;
}