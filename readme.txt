Comandos necessários para iniciar o projeto:

1) Criar o package.json -> npm init -y

2) Importar o express -> npm i express

3) Importar o body-parser -> npm i body-parser

4) Importar o nodemon -> npm i nodemon -g

5) Importar o bcrypt -> npm i bcryptjs

6) Importar o handlebars -> npm i express-handlebars

7) Importar o sequelize -> npm i sequelize

8) Importar o mysql -> npm i mysql2

9) Importar o sequelize-cli -> npm i sequelize-cli

10) Importar o jsonwebtoken -> npm i jsonwebtoken

---------------------------------------------------------

Comandos para criar o banco de dados pelo sequelize

1) Criar o banco de dados -> npx sequelize db:create

2) Criar migration users -> npx sequelize migration:create --name=create-users

3) Criar migration provas -> npx sequelize migration:create --name=create-provas

4) Criar migration posts -> npx sequelize migration:create --name=create-posts

5) Executar migration -> npx sequelize db:migrate