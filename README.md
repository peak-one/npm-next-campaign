## OKR
![image](./OKR.png)


## CheckoutFlow parameter `elementsCustomProperties` default values

| Element for                                             | Property Key                     | Prop value - selector / seletor         | Prop value - Require Validation | Prop value - default value |
|---------------------------------------------------------|----------------------------------|-----------------------------------------|---------------------------------|----------------------------|
| Page form that contains fields like the ones below      | pageFieldsForm                   | [data-page-form]                        | N/A                             | N/A                        |
| Shipping Address AND User first name                    | first_name                       | [data-first-name]                       | True                            | N/A                        |
| Shipping Address AND User last name                     | last_name                        | [data-last-name]                        | True                            | N/A                        |
| Shipping Address                                        | address                          | [data-address]                          | True                            | N/A                        |
| Shipping Address Complement                             | address_line_2                   | [data-shipping-address-line-2]          | False                           | N/A                        |
| Shipping Address Complement                             | address_line_3                   | [data-shipping-address-line-3]          | False                           | N/A                        |
| Shipping Address City                                   | city                             | [data-city]                             | True                            | N/A                        |
| Shipping Address State                                  | state                            | [data-state]                            | True                            | N/A                        |
| Shipping Address Postcode/Zip                           | postcode                         | [data-zip]                              | True                            | N/A                        |
| Shipping Address Country                                | country                          | [data-country]                          | True                            | N/A                        |
| Shipping Address AND User phone                         | phone_number                     | [data-phone]                            | False                           | N/A                        |
| Shipping Address Notes                                  | notes                            | [data-notes]                            | False                           | N/A                        |
| Billing Address First Name                              | first_name                       | [data-billing-first-name]               | True                            | N/A                        |
| Billing Address Last Name                               | last_name                        | [data-billing-last-name]                | True                            | N/A                        |
| Billing Address                                         | address                          | [data-billing-address]                  | True                            | N/A                        |
| Billing Address Complement                              | address_line_2                   | [data-billing-address-line-2]           | False                           | N/A                        |
| Billing Address Complement                              | address_line_3                   | [data-billing-address-line-3]           | False                           | N/A                        |
| Billing Address City                                    | city                             | [data-billing-city]                     | True                            | N/A                        |
| Billing Address State                                   | state                            | [data-billing-state]                    | True                            | N/A                        |
| Billing Address Postcode/Zip                            | postcode                         | [data-billing-zip]                      | True                            | N/A                        |
| Billing Address Country                                 | country                          | [data-billing-country]                  | True                            | N/A                        |
| Billing Address Phone                                   | phone_number                     | [data-billing-phone]                    | False                           | N/A                        |
| Billing Address Notes                                   | notes                            | [data-billing-notes]                    | False                           | N/A                        |
| Email                                                   | email                            | [data-email]                            | True                            | N/A                        |
| Checkbox for "billing same as shipping address"         | billing_same_as_shipping_address | [data-billing-same-as-shipping-address] | N/A                             | True                       |
| Checkbox for "use default billing address" to the user  | use_default_billing_address      | [data-default-billing-address]          | N/A                             | False                      |
| Checkbox for "use default shipping address" to the user | use_default_shipping_address     | [data-default-shipping-address]         | N/A                             | False                      |
| Payment Method Element for Card                         | card_token                       | [data-payment-method-card]              | N/A                             | N/A                        |
| Payment Method Element for Paypal                       | paypal                           | [data-payment-method-paypal]            | N/A                             | N/A                        |
| DEFAULT **SELECTOR** FOR THE SELECTED ELEMENT/ITEM      | selectedItems                    | [data-selected]                         | N/A                             | N/A                        |

