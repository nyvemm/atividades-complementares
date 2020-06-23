module.exports = {
    loggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        } else {
            req.flash('Você precisa estar logado para acessar essa página')
            res.redirect('/login')
        }
    }
}