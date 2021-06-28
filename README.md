# sistema-de-lembretes-dos-alunos
Site desenvolvido com Node.js para os estudantes executarem tarefas como adicionar, acompanhar, editar e excluir suas avaliações e trabalhos escolares.

<h1>Antes de executar o projeto, realize as etapas abaixo.</h1>

<h2>Criar o Package.json</h2>
npm init -y

<h2>Importar o Express</h2>
npm i express

<h2>Importar o Body-parser</h2>
npm i body-parser

<h2>Importar o Nodemon</h2>
npm i nodemon -g

<h2>Importar o bcrypt</h2>
npm i bcryptjs

<h2>Importar o Handlebars</h2>
npm i express-handlebars

<h2>Importar o Sequelize</h2>
npm i sequelize

<h2>Importar o MySql</h2>
npm i mysql2

<h2>Importar o Sequelize-cli</h2>
npm i sequelize-cli

<h2>Importar o JsonWebToken</h2>
npm i jsonwebtoken

<h2>Importar o Chart.js</h2>
npm i chart.js

<h2>Importar o Nodemailer</h2>
npm i nodemailer

<h1>Comandos para criar o banco de dados pelo sequelize</h1>

<h2>Criar o banco de dados</h2>
npx sequelize db:create
  
<h2>Criar migration users (não obrigatório)</h2>
npx sequelize migration:create --name=create-users
  
<h2>Criar migration provas (não obrigatório)</h2>
npx sequelize migration:create --name=create-provas
  
<h2>Criar migration posts (não obrigatório)</h2>
npx sequelize migration:create --name=create-posts
  
<h2>Executar migrations</h2>
npx sequelize db:migrate
  
  
  
  
  
  
