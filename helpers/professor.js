const database = require("../config/database/knex")

module.exports = {
    loginProfessor: (req, res, next) => {
        if (req.isAuthenticated()) {
            database.select().from('professor').where({
                login: req.user.login
            }).then((data) => {
                if (data[0] == undefined) {
                    req.flash('Você precisa ser um professor para acessar essa página')
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