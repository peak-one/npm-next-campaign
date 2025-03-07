export interface Address {
  country: string;
  first_name: string;
  last_name: string;
  line1: string;
  line2?: string;
  line3?: string;

  /**
   * @description `City`
   */
  line4: string;
  notes?: string;
  phone_number?: string;
  postcode?: string;
  state?: string;
}

export interface RequestAddress extends Address {
  is_default_for_billing?: boolean;
  is_default_for_shipping?: boolean;
}
