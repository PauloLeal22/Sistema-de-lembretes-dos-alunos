const Post = require('../models/Post')

class HomeController{
    async index(req, res){
        res.render('index')
    }

    async cadastro(req, res){
        res.render('cadastro')
    }

    async login(req, res){
        res.render('login')
    }

    async adm(req, res){
        res.render('loginAdm')
    }

    async help(req, res){
        res.render('help')
    }

    async post(req, res){
        const {nome, email, assunto} = req.body

        try {
            if(nome == '' || email == '' || assunto == ''){
                res.send('Não foi possível enviar a mensagem!')
            }
    
            await Post.create({
                nome,
                email,
                assunto
            })
    
            return res.render('successPost')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new HomeController