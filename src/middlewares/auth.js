// Importando a biblioteca jwt e o token secret
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

module.exports = (req, res, next) => {
    // Recebendo o token pela requisição
    const authHeader = req.headers.authorization

    // Verificando se o token existe
    if(!authHeader){
        return res.status(401).send({error: 'No token provider'})
    }

    // Dividindo o token em duas partes
    const parts = authHeader.split(' ')

    // Verificando se o token tem duas partes
    if(!parts.length == 2){
        return res.status(401).send({error: 'Token error!'})
    }

    // Desestruturando o array do token
    const [scheme, token] = parts

    // Verificando se existe o Bearer no scheme
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({error: 'Token malformatted'})
    }

    // Verificando se o token realmente é válido
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err){
            return res.status(401).send({error: 'Token invalid'})
        }

        req.userId = decoded.id
        console.log(decoded.id)

        return next()
    })
}