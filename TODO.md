Lógica para a criação do pedido

1. se na página existir os elementos para cartão:
  2. o spreedly deve ser instanciado, já que ele que cuida do pagamento via cartão na campaigns API
3. se o meio de pagamento for cartão

- Implement defaultGetShippingMethod

- tem que padronizar o intl tel input nas páginas (isso é um padrão que o Evandro pediu para ter nas páginas) além de que isso mantem a padronização no formato de tel internacional que a 29next exige!

- saveLead()
 se tiver os campos minimos importantes para "salvar o lead" então os event listeners do blur dos campos minimos serão vinculados para chamar o saveLead