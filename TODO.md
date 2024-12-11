O minímo necessário para que eu consiga fazer as requisições para a API da 29next é que o body da requisição tenha as informações minimas
para que isso aconteça eu só preciso me certificar de que eu tenho as informações mais importantes guardadas em um lugar de fácil acesso por toda a aplicação por exemplo a sessionStorage após ter os dados guardados na sessionStorage é só eu recuperar elas durante o momento em que o evento de "comprar" for disparado então o passo a passo lógico seria:

1 - criar uma função para validar qualquer elemento encontrado na página que a 29next aceita no corpo da requisição (os elementos essenciais para criação de order terão validação obrigatoria), e qualquer elemento da página porque como eu não sei como será a estrutura da página eu preciso salva-los independente de onde estarão, e eu preciso validar porque eu quero me permitir mudar de página somente se a validação estiver OK
 - ao chamar a função ela irá validar qualquer elemento encontrado na página e salvar esses dados na sessionStorage

saveLead()
 - se tiver os campos minimos importantes para "salvar o lead" então os event listeners do blur dos campos minimos serão vinculados para chamar o saveLead

eu preciso pressumir que na hora de criar a order eu vou ter todas as informações disponiveis na sessionStorage dessa forma eu chamo ela somente quando eu tiver todos os dados, se eu não tiver algum dado a API da 29next vai me responder