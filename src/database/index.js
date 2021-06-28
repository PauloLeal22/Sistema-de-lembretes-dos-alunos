const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

const User = require('../models/User')
const Avaliacao = require('../models/Avaliacao')
const Post = require('../models/Post')

const connection = new Sequelize(dbConfig)

// Conectando os models "User" e "Avaliacao" com o banco de dados
User.init(connection)
Avaliacao.init(connection)
Post.init(connection)

// Invocando os métodos associate para criar o relaciomento entre as tabelas
Avaliacao.associate(connection.models)
User.associate(connection.models)

module.exports = connection