const express = require('express')
const router = express.Router()
const UserController = require('./controllers/UserController')
const AvaliacaoController = require('./controllers/AvaliacaoController')
const HomeController = require('./controllers/HomeController')
const AdmController = require('./controllers/AdmController')

// Importando o token secret
const authMiddleware = require('./middlewares/auth')

router.get('/', HomeController.index)
router.post('/confirmPost', HomeController.post)
router.get('/cadastro', HomeController.cadastro)
router.get('/login', HomeController.login)
router.get('/help', HomeController.help)
router.post('/sendEmail', UserController.sendEmail)
router.post('/help/changePass', UserController.changePass)
router.post('/help/confirmNewPass', UserController.update)


router.post('/confirmarCadastro', UserController.store)
router.post('/confirmarLogin', UserController.login)

// router.use(authMiddleware)

router.post('/dashboard/:id', AvaliacaoController.index)
router.post('/dashboard/add/:id', AvaliacaoController.showForm)
router.post('/dashboard/add/confirmarAdd/:id', AvaliacaoController.store)
router.post('/dashboard/avAtuais/:id', AvaliacaoController.showCurrent)
router.post('/dashboard/avConc/:id', AvaliacaoController.showCompleted)
router.post('/dashboard/avExc/:id', AvaliacaoController.showRemoved)

router.post('/dashboard/avAtuais/edit/:id', AvaliacaoController.showFormEdit)
router.post('/dashboard/avAtuais/edit/confirmarEdit/:id', AvaliacaoController.update)
router.post('/dashboard/avAtuais/delete/:id', AvaliacaoController.delete)
router.post('/dashboard/avConc/delete/:id', AvaliacaoController.deleteConc)
router.post('/dashboard/avAtuais/complete/:user_id', AvaliacaoController.complete)
router.post('/dashboard/avConc/remake/:id', AvaliacaoController.remakeConc)
router.post('/dashboard/avExc/remake/:id', AvaliacaoController.remakeExc)

router.post('/dashboard/sair/:id', UserController.loggout)
router.post('/dashboardAdm/sair/:id', UserController.loggout)

router.get('/loginadm', HomeController.adm)
router.post('/confirmarLoginAdm', AdmController.login)
router.post('/dashboardAdm/:id', AdmController.index)
router.post('/dashboardAdm/deleteUser/:id', AdmController.delete)
router.post('/dashboardAdm/usersExc/:id', AdmController.showUsersInativos)
router.post('/dashboardAdm/usersExc/remake/:id', AdmController.remakeUser)
router.post('/dashboardAdm/messages/:id', AdmController.messages)
router.post('/dashboardAdm/readOn/:id', AdmController.readOn)

module.exports = router