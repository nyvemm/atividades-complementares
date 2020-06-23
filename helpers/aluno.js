const database = require("../config/database/knex")

module.exports = {
    loginAluno: (req, res, next) => {
        if (req.isAuthenticated()) {
            database.select().from('aluno').where({
                login: req.user.login
            }).then((data) => {
                if (data[0] == undefined) {
                    req.flash('Você precisa ser um aluno para acessar essa página')
                    res.redirect('/dashboard')
                } else {
                    return next()
                }
            })
        } else {
            req.flash('Você precisa estar logado para acessar essa página')
            res.redirect('/login')
        }
    }
}