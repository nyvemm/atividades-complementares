//Importação de Módulos
const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require("passport")
const database = require("../config/database/knex")

var Mail = require('../config/email')
//------------------------------------------------------------

//Rotas
router.get("/", (req, res) => {
    res.render("login")
})

router.get("/registrar", (req, res) => {
    res.render("login/registrar")
})

//Envio do formulário de cadastro
router.post("/registrar", (req, res) => {
    usuario = {
        login: req.body.login,
        senha: req.body.senha,
        nome: req.body.nome,
        email: req.body.email,
    }

    aluno = {
        login: req.body.login,
        rga: req.body.rga,
        ano_ingresso: req.body.ano_ingresso,
        semestre: req.body.semestre
    }

    //Adiciona os erros
    var multiplesErrors = []

    //Verifica se as senhas são iguais
    if (usuario.senha != req.body.senha1) {
        multiplesErrors.push({
            message: "Senhas não conferem"
        })
    }

    //Verifica se a senha não é muito curta
    if (usuario.senha.length < 5) {
        multiplesErrors.push({
            message: "Senha muito curta"
        })
    }

    //Verifica se o login não é muito curta
    if (usuario.login.length < 5) {
        multiplesErrors.push({
            message: "Login muito curto"
        })
    }

    //Verifica se algum erro foi capturado
    if (multiplesErrors.length > 0) {
        res.render("login/registrar", {
            errors: multiplesErrors
        })
    } else {
        //Gera um novo salt para a senha
        bcrypt.genSalt(10, (err, salt) => {
            //Hasheia a senha
            bcrypt.hash(usuario.senha, salt, (err, hash) => {
                console.log(hash)
                usuario.senha = hash
            })
        })

        //Verifica se já existe um usuário com o mesmo login
        database.select().from('usuario').where('login', '=', req.body.login).then((users) => {
            if (users[0] == undefined) {
                //Insere os dados do usuario
                database.insert(usuario).returning('*').into('usuario').then((data) => {
                    database.insert(aluno).returning('*').into('aluno').then((aluno) => {
                        req.flash("success_msg", "Usuário cadastrado com sucesso")
                        res.redirect("/login")
                    }).catch((err) => {
                        req.flash("error_msg", "Já existe um aluno com esse RGA")
                        res.redirect("/login/registrar")
                    })
                }).catch((err) => {
                    console.log(err)
                    req.flash("error_msg", "Erro ao cadastrar usuário")
                    res.redirect("/login/registrar")
                })
            } else {
                req.flash("error_msg", "Já existe um usuário com esse login")
                res.redirect("/login/registrar")
            }
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Erro ao cadastrar usuário")
            res.redirect("/login/regist rar")
        })
    }
})

router.post("/", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req, res, next) => {
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso")
    res.redirect("/login")
})

router.post("/email", (req, res) => {
    //Verifica se tem alguém com esse email
    database.select().from('usuario').where('email', '=', req.body.email).then((data) => {
        console.log(data)
        if (data[0] == undefined) {
            req.flash("error_msg", "Não há nenhuma conta associada a este e-mail")
            res.redirect("/login")
        } else {
            //Gera o token
            var genToken = Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1)
            console.log(data[0].login + " " + genToken)
            //Atualiza o token no banco de dados
            database('usuario').where({
                    login: data[0].login
                })
                .update({
                    token: genToken
                }).then(() => {
                    console.log("Email: ", req.body.email)
                    console.log(genToken)

                    //Parâmetros do e-mail
                    options = {
                        to: req.body.email,
                        subject: "Recuperação de senha",
                        text: "Token de recuperação de senha",
                        html: " \
                        <fieldset> \
                        <h1 style='font: small-caps sans-serif;'>Recuperação de senha </h1>\
                        <hr> \
                        <p style='font: small-caps sans-serif;'>Seu token de recuperação é: <strong>" + genToken + "</strong></p> \
                        </fieldset>"
                    }

                    //Define o e-mail
                    var mail = new Mail({
                        to: options.to,
                        subject: options.subject,
                        message: options.message,
                        text: options.text,
                        html: options.html,
                        successCallback: function (suc) {
                            req.flash("success_msg", 'E-mail enviado com sucesso')
                        },
                        errorCallback: function (err) {
                            req.flash('error_msg', 'Erro ao mandar e-mail')
                        }
                    });
                    //Envia o e-mail
                    //mail.send();
                    res.redirect('/login/esqueci-minha-senha')
                }).catch((err) => {
                    req.flash('error_msg', 'Erro ao salvar dados')
                    res.redirect('/login/')
                })
        }
    })

})

router.get("/esqueci-minha-senha", (req, res) => {
    res.render("login/esqueci-minha-senha")
})

router.post("/trocar-senha", (req, res) => {
    multiplesErrors = []

    if (req.body.senha != req.body.senha1) {
        multiplesErrors.push({
            message: "Senhas não conferem"
        })
    }

    //Verifica se a senha não é muito curta
    if (req.body.senha.length < 5) {
        multiplesErrors.push({
            message: "Senha muito curta"
        })
    }

    if (multiplesErrors.length > 0) {
        res.render("login/esqueci-minha-senha", {
            errors: multiplesErrors
        })
    } else {
        database('usuario').select().where({
            token: req.body.token
        }).then(() => {
            //Gera um novo salt para a senha
            bcrypt.genSalt(10, (err, salt) => {
                //Hasheia a senha
                bcrypt.hash(req.body.senha, salt, (err, hash) => {
                    console.log(hash)
                    database('usuario').where({
                        token: req.body.token
                    }).update({
                        senha: hash
                    }).then(() => {
                        req.flash("success_msg", "Senha trocada com sucesso")
                        res.redirect("/login")
                    }).catch((err) => {
                        console.log(err)
                        req.flash("error_msg", "Erro ao trocar de senha")
                        res.redirect("/login/esqueci-minha-senha")
                    })
                })
            })
        }).catch((err) => {
            console.log(err)
            req.flash("Token inválido")
            res.redirect("/login/esqueci-minha-senha")
        })
    }
})
//------------------------------------------------------------
module.exports = router