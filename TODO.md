- Sobre o billing address ser o mesmo ou não que o shipping address o que eu posso fazer?

OS CENÁRIOS ABAIXO SOBRE O BILLING ADDRESS ESTÃO DO MAIS COMUM AO MENOS (determinado conferindo vários sites e o estatistico GPT)
CENÁRIO 1: "checkbox billSameShip" na página de checkout https://heater-efortify.netlify.app/checkout/
CENÁRIO 2: "checkbox billSameShip" após página de shipping address https://deal.cialix.com/lirtv/gk6kgu7/
CENÁRIO 3: "não existe checkbox na página é um radio de "yes" ou "no"" https://tryetcgummies.com/berberine/v4/checkout.php?prospect_id=5614 nesse caso o que deve ser feito é colocar um checkbox escondido na página e usa-lo no ecommerceFunnel...

ambos os casos tem 1 padrão, o billing address sempre vêm depois do shipping address

- o billSameShip por padrão será true
- se existir uma checkbox na página de billSameShip o valor dessa checkbox que determina o novo valor
- se não existir será true por padrão
- se a pessoa marcar que billSameShip não haverá validação para o billing address
- se a pessoa desmarcar ou seja billSameShip for false, haverá validação do billing address


- tem que padronizar o intl tel input nas páginas (isso é um padrão que o Evandro pediu para ter nas páginas) além de que isso mantem a padronização no formato de tel internacional que a 29next exige!

- saveLead()
 se tiver os campos minimos importantes para "salvar o lead" então os event listeners do blur dos campos minimos serão vinculados para chamar o saveLead

eu preciso pressumir que na hora de criar a order eu vou ter todas as informações disponiveis na sessionStorage dessa forma eu chamo ela somente quando eu tiver todos os dados, se eu não tiver algum dado a API da 29next vai me responder