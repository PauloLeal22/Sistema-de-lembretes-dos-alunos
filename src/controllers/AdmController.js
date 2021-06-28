const User = require('../models/User')
const Avaliacao = require('../models/Avaliacao')
const Post = require('../models/Post')
const bcrypt = require('bcryptjs')

module.exports = {
    async login(req, res){
        const {email, senha} = req.body

        const user = await User.findOne({
            where: {
                email,
                isadm: 1
            }
        })

        if(!user){
            return res.render('loginAdm', {erro: "Email ou senha incorreto!"})
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

        return res.redirect(307, `dashboardAdm/${user_id}`)
    },

    async index(req, res){
        const user_id = req.params.id

        const adm = await User.findByPk(user_id, {
            include: {association: 'avaliacao'}
        })

        const users = await User.findAll({where: {isadm: 0}})

        const ativos = users.filter(user => user.status == 1)

        const inativos = users.filter(user => user.status == 0)

        const online = users.filter(user => user.status == 1 && user.islogged == 1)

        const avaliacoes = await Avaliacao.findAll()

        const avAndamento = (await avaliacoes).filter(av => av.status == 1 && av.iscompleted == 0)

        const avConcluida = (await avaliacoes).filter(av => av.status == 1 && av.iscompleted == 1)

        const avExcluida = (await avaliacoes).filter(av => av.status == 0)

        const posts = await Post.findAll({where: {isread: false}})

        let aviso = ""
        let imgAviso = ""

        if(posts.length > 0){
            aviso = "Há novas mensagens não lidas"
            imgAviso = "/images/alerta.png"
        }else{
            aviso = "Tudo Ok!"
            imgAviso = "/images/verificado.png"
        }

        const filtroUsers = users.map(user => {
            return {
                id: user.id,
                nome: user.nome,
                email: user.email,
                avscad: user.avscad,
                islogged: user.islogged,
                status: user.status
            }
        })

        const tableUsers = users => {
            let usuarios = []
            let situacao = ""
            
            for(let i in users){
                if(users[i].status == 1 && users[i].islogged == 0){
                    situacao = "Ativo"
                } else if(users[i].status == 1 &&users[i].islogged == 1){
                    situacao = "Online"
                }else if(users[i].status == 0){
                    situacao = "Inativo"
                }

                usuarios.push({
                    id: users[i].id,
                    nome: users[i].nome,
                    email: users[i].email,
                    avs: users[i].avscad,
                    situacao: situacao
                })
            }

            return usuarios
        }

        return res.render('homeAdm', {
            id: user_id,
            nome: adm.nome,
            users: users.length,
            ativos: ativos.length,
            inativos: inativos.length,
            online: online.length,
            avaliacoes: avaliacoes.length,
            avAndamento: avAndamento.length,
            avConcluida: avConcluida.length,
            avExcluida: avExcluida.length,
            tableUsers: tableUsers(filtroUsers),
            aviso,
            imgAviso
        })
    },

    async delete(req, res){
        const id = req.params.id
        const id_user = req.body.id_usuario

        try {
            const usuarios = await User.findAll({where: {id: id_user}})

            if(usuarios){
                await User.update({
                    status: 0
                }, {
                    where: {
                        id: id_user
                    }
                })

                return res.redirect(307, `../../dashboardAdm/${id}`)

            }else{
                return res.status(400).json({
                    status: 0,
                    message: 'Usuário não encontrado!'
                })
            }
        } catch (err) {
            return res.status(400).json({error: err})
        }
    },

    async showUsersInativos(req, res){
        const user_id = req.params.id

        const inativos = await User.findAll({
            where: {
                status: 0
            }
        })

        return res.render('usersExcAdm', {id: user_id, inativos: inativos})
    },

    async remakeUser(req, res){
        const id = req.params.id

        try {
            const user = await User.findByPk(id)

            if(user){
                await User.update({
                    status: 1
                }, {
                    where: {
                        id: id
                    }
                })

                return res.redirect(307, `../../usersExc/1`)

            }else{
                return res.status(400).json({
                    status: 0,
                    message: 'Usuário não encontrado!'
                })
            }
        } catch (err) {
            return res.status(400).json({error: err})
        }
    },

    async messages(req, res){
        try {
            const posts = await Post.findAll()

            return res.render('messages', {posts: posts})

        } catch (error) {
            console.log(error)
        }
    },

    async readOn(req, res){
        try {
            const id = req.params.id

            await Post.update({
                isread: 1
            }, {
                where: {
                    id: id
                }
            })

            res.redirect(307, '../messages/1')
        } catch (error) {
            console.log(error)
        }
    }

    
}