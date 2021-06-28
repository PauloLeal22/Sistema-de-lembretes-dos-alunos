const User = require('../models/User')
const Avaliacao = require('../models/Avaliacao')

module.exports = {
    // Busca completa no banco
    async index(req, res){
        const user_id = req.params.id 
        
        // Consultando usuário no banco
        const usuario = await User.findAll({
            where: {
                id: user_id
            }
        })

        const islogged = usuario.filter(u => {
            return u.islogged
        })

        // Verificando se ele já está logado
        if(islogged == 0){
            res.redirect('../../login')
        }else{

            // Select nas avaliações do usuário
            const user = await User.findByPk(user_id, {
                include: {association: 'avaliacao'}
            })

            if(!user){
                return res.status(400).send({
                    status: 0,
                    message: 'Avaliacões não encontrados!'
                })
            }

            // Select em todas as avaliações do usuário
            const avaliacoes = await Avaliacao.findAll({
                where: {
                    user_id: user_id
                }
            })

            // Select em todas as avaliações em andamento
            const avAndamento = avaliacoes.filter(avaliacao => {
                if(avaliacao.iscompleted == 0 && avaliacao.status == 1){
                    return avaliacao
                }
            })

            // Select em todas as avaliações concluídas
            const avConcluida = avaliacoes.filter(avaliacao => {
                if(avaliacao.iscompleted == 1 && avaliacao.status == 1){
                    return avaliacao
                }
            })

            // Select em todas as avaliações excluidas
            const avExcluida = avaliacoes.filter(avaliacao => {
                if(avaliacao.status == 0){
                    return avaliacao
                }
            })

            // Select apenas nos campos "disciplina", "materia" e "nota" das avaliações
            const avNotas = avaliacoes.map(avaliacao => {
                return {
                    disciplina: avaliacao.disciplina,
                    materia: avaliacao.materia,
                    nota: avaliacao.nota
                }
            })

            let maioresNotas = avaliacoes => {
                let notas = []
                let provas = []
                let maiores = []
                let avMaiores = []
                let disc = []
                let discMaiores = []
                let posMaiorNota = ""

                for(let i in avaliacoes){
                    notas.push(avaliacoes[i].nota)
                    provas.push(avaliacoes[i].materia)
                    disc.push(avaliacoes[i].disciplina)
                }

                for(let i = 0; i <= 2; i++){
                    maiores.push(Math.max.apply(Math, notas))
                    posMaiorNota = notas.indexOf(maiores[i])

                    avMaiores.push(provas[notas.indexOf(maiores[i])])
                    discMaiores.push(disc[notas.indexOf(maiores[i])])

                    notas.splice(posMaiorNota, 1)
                    provas.splice(posMaiorNota, 1)
                    disc.splice(posMaiorNota, 1)
                }

                return {
                    maiores,
                    avMaiores,
                    discMaiores
                }
            }

            let menoresNotas = avaliacoes => {
                let notas = []
                let provas = []
                let menores = []
                let avMenores = []
                let disc = []
                let discMenores = []
                let posMenorNota = ""

                for(let i in avaliacoes){
                    if(avaliacoes[i].nota != null){
                        notas.push(avaliacoes[i].nota)
                        provas.push(avaliacoes[i].materia)
                        disc.push(avaliacoes[i].disciplina)
                    }
                }

                for(let i = 0; i <= 2; i++){
                    menores.push(Math.min.apply(Math, notas))
                    posMenorNota = notas.indexOf(menores[i])

                    avMenores.push(provas[notas.indexOf(menores[i])])
                    discMenores.push(disc[notas.indexOf(menores[i])])

                    notas.splice(posMenorNota, 1)
                    provas.splice(posMenorNota, 1)
                    disc.splice(posMenorNota, 1)
                }

                return {
                    menores,
                    avMenores,
                    discMenores
                }
            }

            // Armazenando todos os campos em um objeto
            const avs = avaliacoes.map(avaliacao => {
                return {
                    disciplina: avaliacao.disciplina,
                    materia: avaliacao.materia,
                    data: avaliacao.data,
                    nota: avaliacao.nota,
                    status: avaliacao.status,
                    iscompleted: avaliacao.iscompleted
                }
            })

            // Manipulando os dados 
            const tableAvaliacoes = avaliacoes => {
                let provas = []
                let situacao = ""
                
                for(let i in avaliacoes){
                    if(avaliacoes[i].status == 1 && avaliacoes[i].iscompleted == 0){
                        situacao = "Andamento"
                    } else if(avaliacoes[i].status == 1 && avaliacoes[i].iscompleted == 1){
                        situacao = "Concluída"
                    }else if(avaliacoes[i].status == 0){
                        situacao = "Excluída"
                    }

                    provas.push({
                        disciplina: avaliacoes[i].disciplina,
                        materia: avaliacoes[i].materia,
                        nota: avaliacoes[i].nota,
                        data: avaliacoes[i].data,
                        situacao: situacao
                    })
                }

                return provas
            }
            
            return res.render('home', {
                id: user_id,
                nome: user.nome,
                situacao: avaliacoes.length,
                totalAv: avaliacoes.length,
                avAndamento: avAndamento.length,
                avConcluida: avConcluida.length,
                avExcluida: avExcluida.length,
                menorNota: menoresNotas(avNotas).menores[0],
                maiorNota: maioresNotas(avNotas).maiores[0],
                avMenorNota: menoresNotas(avNotas).discMenores[0],
                avMaiorNota: maioresNotas(avNotas).discMaiores[0],
                maioresNotas: maioresNotas(avNotas).maiores,
                avMaioresNotas: maioresNotas(avNotas).avMaiores,
                menoresNotas: menoresNotas(avNotas).menores,
                avMenoresNotas: menoresNotas(avNotas).avMenores,
                tableAvaliacoes: tableAvaliacoes(avs)
            })
        }
    },

    // Salvar avaliação
    async store(req, res){
        const user_id = req.params.id
        const {disciplina, materia, professor, data, observacao} = req.body

        // Select no usuário
        const user = await User.findOne({where: {id: user_id}})

        if(!user){
            return res.status(400).json({
                status: 0,
                message: 'Usuário não encontrado!'
            })
        }

        await Avaliacao.create({
            disciplina,
            materia,
            professor,
            data,
            observacao,
            iscompleted: 0,
            status: 1,
            user_id
        })

        // Atualizando o número de avaliações cadastradas pelo usuário 
        const avsCad = user.avscad + 1

        await User.update({
            avscad: avsCad
        }, {
            where: {
                id: user_id
            }
        })

        res.redirect(307, `../../${user_id}`)
    },

    // Deletar a avaliação de acordo com o id
    async delete(req, res){
        const id = req.params.id
        const id_avaliacao = req.body.id_avaliacao

        try {
            const avaliacoes = await Avaliacao.findAll({where: {id: id_avaliacao}})

            // Modificando o campo status para 0
            if(avaliacoes){
                await Avaliacao.update({
                    status: 0
                }, {
                    where: {
                        id: id_avaliacao
                    }
                })

                return res.redirect(307, `../../avAtuais/${id}`)

            }else{
                return res.status(400).json({
                    status: 0,
                    message: 'Avaliação não encontrada!'
                })
            }
        } catch (err) {
            return res.status(400).json({error: err})
        }
    },

    // Deletar uma avaliação e redirecionar para a página de concluidas
    async deleteConc(req, res){
        const id = req.params.id

        try {
            const avaliacoes = await Avaliacao.findByPk(id)

            // Modificando o campo status para 0
            if(avaliacoes){
                await Avaliacao.update({
                    status: 0
                }, {
                    where: {
                        id: id
                    }
                })

                return res.redirect(307, `../../avConc/${avaliacoes.user_id}`)

            }else{
                return res.status(400).json({
                    status: 0,
                    message: 'Avaliação não encontrada!'
                })
            }
        } catch (err) {
            return res.status(400).json({error: err})
        }
    },

    // Alterar dados da avaliação de acordo com o id
    async update(req, res){
        const id_user = req.params.id
        const {id_avaliacao, disciplina, materia, professor, data, observacao} = req.body

        await Avaliacao.update({
            disciplina,
            materia,
            professor,
            data,
            observacao
        }, {
            where: {
                id: id_avaliacao,
                user_id: id_user
            }
        })

        return res.redirect(307, `../../${id_user}`)
    },

    // Considerar a avaliação completada
    async complete(req, res){
        const user_id = req.params.user_id
        const id_avaliacao = req.body.id_avaliacao
        const nota = req.body.nota

        // Select na avaliação que será completada
        const avaliacao = await Avaliacao.findAll({
            where: {
                user_id: user_id,
                id: id_avaliacao
            }
        })        

        if(avaliacao === 'undefined' || avaliacao === 'null' || avaliacao.length === 0){
            res.status(200).send({message: "Nenhuma avaliação encontrada!"})
        }

        // Atribuindo uma nota e alterando o campo isCompleted para true
        await Avaliacao.update({
            nota: nota,
            iscompleted: true
        }, {
            where: {
                id: id_avaliacao,
                user_id: user_id
            }
        })

        res.redirect(307, `../../avAtuais/${user_id}`)
    },

    // Remover a avaliação da lista de concluídas
    async remakeConc(req, res){
        const id = req.params.id

        try {
            const avaliacoes = await Avaliacao.findByPk(id)

            // Modificando o campo isCompleted para false
            if(avaliacoes){
                await Avaliacao.update({
                    iscompleted: 0
                }, {
                    where: {
                        id: id
                    }
                })

                return res.redirect(307, `../../avConc/${avaliacoes.user_id}`)

            }else{
                return res.status(400).json({
                    status: 0,
                    message: 'Avaliação não encontrada!'
                })
            }
        } catch (err) {
            return res.status(400).json({error: err})
        }
    },

    // Remover a avaliação da lista de excluídas
    async remakeExc(req, res){
        const id = req.params.id

        try {
            const avaliacoes = await Avaliacao.findByPk(id)

            // Modificando o campo isCompleted para false
            if(avaliacoes){
                await Avaliacao.update({
                    status: 1,
                    iscompleted: 0
                }, {
                    where: {
                        id: id
                    }
                })

                return res.redirect(307, `../../avExc/${avaliacoes.user_id}`)

            }else{
                return res.status(400).json({
                    status: 0,
                    message: 'Avaliação não encontrada!'
                })
            }
        } catch (err) {
            return res.status(400).json({error: err})
        }
    },

    // Redireciona para o formulário de adição de avaliações
    async showForm(req, res){
        const user_id = req.params.id

        res.render('add', {id: user_id})
    },

    // Redireciona para a página das avaliações atuais
    async showCurrent(req, res){
        const user_id = req.params.id

        // Select nas avaliações que não estão completas 
        const avaliacoes = await Avaliacao.findAll({
            where: {
                user_id: user_id,
                status: 1,
                isCompleted: 0
            }
        })

        return res.render('avAtuais', {id: user_id, avaliacoes: avaliacoes})
    },

    // Redireciona para a página das avaliações completadas
    async showCompleted(req, res){
        const user_id = req.params.id

        const avaliacoes = await Avaliacao.findAll({
            where: {
                user_id: user_id,
                status: 1,
                isCompleted: 1
            }
        })

        return res.render('avConc', {id: user_id, avaliacoes: avaliacoes})
    },

    // Redireciona para a página das avaliações removidas
    async showRemoved(req, res){
        const user_id = req.params.id

        const avaliacoes = await Avaliacao.findAll({
            where: {
                user_id: user_id,
                status: 0
            }
        })

        return res.render('avExc', {id: user_id, avaliacoes: avaliacoes})
    },

    // Redireciona para o formulário de edição 
    async showFormEdit(req, res){
        const id = req.params.id

        const avaliacao = await Avaliacao.findAll({
            where: {
                id: id
            }
        })

        res.render('edit', {id: id, avaliacao: avaliacao})
    }
}