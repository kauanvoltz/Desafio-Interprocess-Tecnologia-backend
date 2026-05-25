Assim que pegar o projeto, utilize o comando yarn install para instalar todas as dependências.

Depois disso, copie o arquivo .env.example e crie um arquivo .env com os mesmos dados e variáveis.

Em seguida, faça o setup do Prisma executando os comandos:

yarn prisma generate

yarn prisma migrate deploy

Por fim, utilize o comando yarn dev para iniciar a aplicação em modo de desenvolvimento.
