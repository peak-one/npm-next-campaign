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


Um dos diferenciais da peak one é que não trabalhamos com templates padrões, ou seja, o cliente não fica limitado a apenas algumas opções de "tipos de página", "layouts", "templates", ele pode pedir um clone de um site onde todos os campos de endereço ficam em 1 página, ou os campos de endereço ficam espalhados em multiplas páginas, por exemplo, somente os campos nome, sobrenome, e email em uma página, endereço de entrega em outra, e por fim endereço de entrega + meios de pagamento em outra. No fim, para que o pedido aconteça, só temos que ter o minimo necessário de dados para que o pedido seja concluido. Como estamos integrando com a "Campaigns API" o minimo necessário é a propria API que determina, mas continue lendo, não se preocupe com isso por hora.

Para que a criação do pedido com o minimo necessário de dados aconteça, esse pacote pressume que no momento da criação do pedido eu terei todos os dados. Como os layouts podem ser diferentes, o código procura tentar encontrar determinados elementos na página, e tomar ações diferentes caso encontre-os ou não. Tudo vai se resumir em "IF" no final

Os dados que forem pegos para criação da order serão armazenados na sessionStorage para que permaneça com acesso "global" ao longo das páginas.

Além de um acesso global aos dados para criar a order, o pacote também conta com um "tomador de decisão" para saber de que maneira a order será criada, se vai ser com "cartão", "paypal", e outros possiveis existentes métodos de pagamento. Como cada página segue um "template" diferente e inesperado..., para o código "tomar a decisão" eu preciso que esse tomador seja flexivel aos diferentes templates que possam existir, porém uma coisa é fato entre todos os templates

O que definirá qual o método de pagamento escolhido será um código que irá escutar eventos de click, do elemento que representar a opção e quando essa opção for clicada ela "seta" o meio de pagamento que a createOrder usará, o meio padrão será cartão

Os botões que executam a criação na order devem ter um determinado atributo data


- Sobre o billing address ser o mesmo ou não que o shipping address o que eu posso fazer?

OS CENÁRIOS ABAIXO SOBRE O BILLING ADDRESS ESTÃO DO MAIS COMUM AO MENOS (determinado conferindo vários sites e o estatistico GPT)
CENÁRIO 1: "checkbox billSameShip" na página de checkout https://heater-efortify.netlify.app/checkout/
CENÁRIO 2: "checkbox billSameShip" após página de shipping address https://deal.cialix.com/lirtv/gk6kgu7/
CENÁRIO 3: "não existe checkbox na página é um radio de "yes" ou "no"" https://tryetcgummies.com/berberine/v4/checkout.php?prospect_id=5614 nesse caso o que deve ser feito é colocar um checkbox escondido na página e usa-lo no CheckoutFlow...

ambos os casos tem 1 padrão, o billing address sempre vêm depois do shipping address

- o billSameShip por padrão será true
- se existir uma checkbox na página de billSameShip o valor dessa checkbox que determina o novo valor
- se não existir será true por padrão
- se a pessoa marcar que billSameShip não haverá validação para o billing address
- se a pessoa desmarcar ou seja billSameShip for false, haverá validação do billing address