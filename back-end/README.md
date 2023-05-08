## Tecnologias: NODE, FASTIFY, TS, PRISMA E POSTGRES

Para realizar o deploy dessa API eu utilizei a hospedagem gratuita do [render](https://render.com).

URL: https://tegrafood-api.onrender.com

## Tabelas
### User
- id
- name
- email
- password
- createdAt

### Product
- id
- title
- description
- priceInCents
- imageUrl
- categories

### Cart - Tabela Relacional
- id           
- userId    
- productId 
- quantity  
- createdAt

## Rotas de Autenticação 

### Cadastro (POST - /signup) 
Recebe no no body:
- email
- password
- name

O sistema verifica se o usuário já está cadastrado no banco de dados. Se o usuário não existir, um novo cadastro é criado.

Após a criação ou verificação do cadastro, o sistema verifica se o usuário é administrador, identificando a presença do domínio "@tegrafood.com" no endereço de email.

Em seguida, é gerado um token de autenticação que expira em 7 dias, permitindo que o usuário tenha acesso às funcionalidades restritas. São o token e uma variavel que informa se o usuário é administrador ou não (isAdmin) são enviados no response.

### Login (POST - /login) 
Recebe no no body:
- email
- password

O sistema verifica se o usuário já está cadastrado no banco de dados. Se o usuário existir ou a senha não bater, um erro é gerado.

O sistema verifica se o usuário é administrador e gera o token de autenticação que são enviados no response.

## Rotas de Produtos

### Listagem dos produtos (GET - /products) 
Verifica a autenticação e lista todos os produtos.

### Cria um produto (POST - /products) 
Verifica a autenticação e recebe no no body:
- title
- description
- imageUrl 
- categories - lista de números de 0 a 4 representando as categorias [0: Pizza, 1: Sobremesa, 2: Lanche, 3: Açaí, 4: Bebidas] 
- priceInCents - guardar o valor em centavos torna a manipulação desses valores mais precisa e evita possíveis erros de arredondamento.

Após verificações, cria o produto no banco de dados.

### Atualiza um produto (PUT - /products/:productId) 
Verifica a autenticação e recebe no no body:
- title
- description
- imageUrl 
- categories
- priceInCents

Identifica o produto pelo productId, e atualiza as informações no banco de dados.

### Atualiza um produto (POST - /products/:productId/cart) 
O sistema verifica se já existe um cart para o usuário com o id produto informado. Para isso, é realizada uma busca no banco de dados.

Se o cart já existir, na quantidade do produto adicionado +1. Caso contrário, um novo item é adicionado ao cart com a quantidade inicial igual a um.

## Rotas do Carrinho

### Listagem dos produtos do carrinho (GET - /cart) 
Verifica a autenticação e busca informações dos produtos que estão no carrinho de um usuário. As informações selecionadas são:
- cartId
- title
- description
- quantity
- imageUrl
- priceInCents

Todos são envidos no response no array "cartProducts".

### Remoção dos produtos do carrinho (DELETE - /cart) 
Verifica a autenticação e deleta todos os produtos desse usuário.

### Atualiza a quantida do produto no carrinho (PATCH - /cart/:cartId/quantity) 
Verifica a autenticação e recebe a quantity no body, e atualiza a quantida do produto no cart.

### Deleta do produto do carrinho (DELETE - /cart/:cartId) 
Verifica a autenticação e deleta o produto específico do carrinho.
