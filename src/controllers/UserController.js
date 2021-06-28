const User = require('../models/User')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

// Importando a lib jwt e o token secret
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

// Gerando o token do usuário
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 78300 // Token expira em +- 21h
    })
}

module.exports = {
    async login(req, res){
        const {email, senha} = req.body

        // Fazendo um select no bd de acordo com o email
        const user = await User.findOne({where: {email}})

        if(!user){
            return res.render('login', {erro: "Email ou senha incorreto!"})
        }

        // Verificando se a senha fornecida é igual a senha do usuario no bd
        if(!bcrypt.compareSync(senha, user.senha)){
            return res.render('login', {erro: "Email ou senha incorreto!"})
        }

        const user_id = user.id

        // Atualizando o campo islogged para true
        await User.update({
            islogged: 1
        }, {
            where: {
                id: user_id
            }
        })

        user.senha = undefined

        // Gerando o token do usuario
        const token = generateToken({id: user.id})

        return res.redirect(307, `dashboard/${user_id}`)
    },

    // Salvar dados
    async store(req, res){
        const {nome, email, senha, Rsenha} = req.body

        if(senha !== Rsenha){
            return res.render('cadastro', {erro: "As senhas não estão iguais!"})
        }

        // Verificando se o email já está cadastrado
        const verificacao = await User.findAll({
            where: {
                email: email
            }
        })

        if(verificacao.length > 0){
            return res.render('cadastro', {erro: "Esse email já está cadastrado!"})
        }

        // Cadastrando usuário
        const usuario = await User.create({
            nome,
            email,
            senha,
            islogged: 1
        })

        // Gerando o token do usuario
        const token = generateToken({id: usuario.id})

        const user_id = usuario.id

        return res.redirect(307, `dashboard/${user_id}`)
    },

    // Atualizar dados
    async update(req, res){
        const id = req.body.id
        const senha = req.body.senha

        // Criptografando a senha 
        const salt = bcrypt.genSaltSync()
        const Newsenha = bcrypt.hashSync(senha, salt)

        // Modificando a senha no banco
        await User.update({
            senha: Newsenha
        }, {
            where: {
                id: id
            }
        })

        return res.render('successPass')
    },

    // Fazer loggout
    async loggout(req, res){
        const user_id = req.params.id

        // Modificando o isLogged para false
        User.update({
            islogged: false
        }, {
            where: {
                id: user_id
            }
        })

        res.redirect('../../login')
    },

    // Mandar email de recuperação de senha
    async sendEmail(req, res){
        const user_email = req.body.email

        // Consultando o usuário no banco
        const user = await User.findOne({
            where: {
                email: user_email
            }
        })

        // Config da conta do email
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", 
            port: 465, 
            secure: true, 
            auth: {
                user: "slasuporte24h@gmail.com", 
                pass: "ph27092002" 
            }
        })
        
        // Config do email
        transporter.sendMail({
            from: "Suporte SLA <slasuporte24h@gmail.com>", 
            to: user_email, 
            subject: "Alteração de senha do SLA", 
            text: "Não responda esse email.", 
            html: `<h1>Olá ${user.nome}!</h1> <br>
                    <p>Verificamos que você solicitou a alteração da senha da sua conta SLA.</p>
                    <p><span style = "color: red">Se você não reconhece essa solicitação, pedimos que desconsidere esse e-mail.</span></p>
                    <p>Para redefinir sua senha clique no botão abaixo.</p>
                    <form action="http://localhost:3000/help/changePass" method="post">
                        <input type="hidden" name="id" value="${user.id}">
                        <button type="submit">Alterar senha</button>
                    </form>`
        }).then(message => {
            console.log(message)
        }).catch(err => {
            console.log(err)
        })

        return res.render('sendEmail')
    },
    
    // Redirecionar para o formulário de alteração de senha
    async changePass(req, res){
        const id = req.body.id
        return res.render('changePass', {id: id})
    }
}