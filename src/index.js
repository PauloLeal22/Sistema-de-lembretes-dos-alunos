const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const path = require('path')
const routes = require('./routes')

require('./database')

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(routes)

// Configs
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname,'public')))

app.listen(3000, () =>  console.log('Servidor Rodando...'))