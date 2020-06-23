//Importação de Módulos
const knex = require('knex')
const path = require("path")
const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')

//Tratamento de exceção
const flash = require("connect-flash")

//Autenticação
const passport = require('passport')
require('./config/authentication/auth')(passport)

//Sessão
const session = require("express-session")

//Banco de Dados
var database = require("./config/database/knex");

//Rotas
const login = require("./routes/login")
const aluno = require("./routes/aluno")
const professor = require("./routes/professor")

//------------------------------------------------------------

//Configuração do Express
const app = express()

//Configuração da Sessão
app.use(session({
    secret: "labbd2020",
    resave: true,
    saveUnitialized: true
}))

//Configuração do Flash-express
app.use(flash())

//Configuração do Body Parser
app.use(bodyParser.urlencoded({
    extended: true
}))

//Configuração do Handlebars
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

//Configuração da Sessão
app.use(passport.initialize())
app.use(passport.session())

//Variáveis globais
var role = null

//Configuração de Middlewares
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    //Verifica se o 
    res.locals.error = req.flash("error")
    //Verifica se o usuário está logados
    res.locals.user = req.user || null
    res.locals.admin = role
    next()
})

//Privilégios de Acesso
const {
    loggedIn
} = require("./helpers/login")
const {
    resolveCname
} = require('dns')

//------------------------------------------------------------

//Definição da pasta "public", aonde ficarão os arquivos do Front-end
app.use(express.static(path.join(__dirname, "public")))

//------------------------------------------------------------

//Importação de Rotas
app.use('/login', login)
app.use('/aluno', aluno)
app.use('/professor', professor)

//Definição de Rotas
app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/dashboard', (req, res) => {
    database.select().from('aluno').where('login', req.user.login).then((data) => {
        //É professor
        if (data[0] == undefined) {
            role = true
            res.redirect('/professor')
            //É aluno
        } else {
            role = false
            res.redirect('/aluno')
        }
    })
})
//------------------------------------------------------------

//Configuração do Servidor
const PORT = process.env.PORT | 8081
app.listen(PORT, () => {
    console.log("Server running");
})