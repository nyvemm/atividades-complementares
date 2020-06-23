//Carregando módulos

const bcrypt = require("bcryptjs")
const passport = require("passport")
var database = require("../database/knex");
const localStrategy = require("passport-local").Strategy


//------------------------------------------------------------

module.exports = (passport) => {
    passport.use(new localStrategy({
        usernameField: 'login',
        passwordField: 'password'
    }, (login, password, done) => {
        //Procura o usuário com nome e senha
        database.select().from('usuario').where('login', '=', login).then((data) => {
            //Usuário não existe 
            if (data[0] == undefined) {
                return done(null, false, {
                    message: "Usuário ou senha inválidos"
                })
            }
            //Hasheia a senha e compara com a sneha do banco de dados.
            bcrypt.compare(password, data[0].senha, (err, matches) => {
                if (matches) {
                    return done(null, data[0])
                } else {
                    //Senhas não conferem
                    return done(null, false, {
                        message: "Usuário ou senha inválidos"
                    })
                }
            })
        })
    }))
}

//------------------------------------------------------------

//Serialização
passport.serializeUser((user, done) => {
    done(null, user.login)
})

//Deserialização
passport.deserializeUser((login, done) => {
    database('usuario').where({
        login: login
    }).then(([user]) => {
        if (user) {
            role = null
            done(null, user)
        }
    })
})