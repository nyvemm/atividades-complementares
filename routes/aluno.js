//Importação de Módulos
const express = require('express')
const router = express.Router()
const passport = require("passport")
const database = require("../config/database/knex")
const multer = require("multer")
const path = require("path")

//Configuração do Multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, req.user.login + "_" + req.body.atv_complementar_cod + "_" +
            file.originalname);
    }
})

const upload = multer({
    storage
})

//Verificação Login
const {
    loggedIn
} = require("../helpers/login")

const {
    loginAluno
} = require("../helpers/aluno")
const knex = require('../config/database/knex')
const {
    select,
    where
} = require('../config/database/knex')

//------------------------------------------------------------

//Rotas
router.get("/", loginAluno, (req, res) => {
    database.select().from('aluno').innerJoin('usuario', 'aluno.login', 'usuario.login')
        .where('usuario.login', req.user.login).then((alunos) => {
            res.render("aluno/index", {
                aluno: alunos[0]
            })
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Erro interno")
            res.redirect("/login")
        })
})

//------------------------------------------------------------
router.get("/atividades", loginAluno, (req, res) => {
    database.select().from('aluno').where('login', req.user.login).then((aluno) => {
        database.select().from('atividade_complementar').innerJoin('tipo_atividade',
                'tipo_atividade.cod_tipo_atividade', 'atividade_complementar.tipo_atividade')
            .where('rga_aluno', aluno[0].rga).then((atividades) => {
                atividades.forEach((atividade) => {
                    atividade.data_inicio = atividade.data_inicio.getDate() + "/" + (parseInt(atividade.data_inicio.getMonth()) + 1) + "/" + atividade.data_inicio.getFullYear()
                    atividade.data_fim = atividade.data_fim.getDate() + "/" + (parseInt(atividade.data_fim.getMonth())) + 1 + "/" + atividade.data_fim.getFullYear()
                })
                res.render("aluno/atividades/atividades", {
                    atividade: atividades
                })
            })
    }).catch((err) => {
        console.log(err)
        req.flash("Erro interno")
        res.redirect("/aluno")
    })
})

router.get("/atividades/cadastrar", loginAluno, (req, res) => {
    database.select().from('tipo_atividade').then((atividades) => {
        database.select().from('aluno').where({
            'login': req.user.login
        }).then((alunos) => {
            res.render("aluno/atividades/cadastrar", {
                atividade: atividades,
                aluno: alunos[0]
            })
        }).catch((err) => {
            console.log(err)
            req.flash("Erro interno")
            res.redirect("/aluno")
        })
    })
})

router.post("/atividades/cadastrar", loginAluno, (req, res) => {
    database.insert(req.body).returning('*').into('atividade_complementar').then(() => {
        req.flash("success_msg", "Atividade complementar cadastrada com sucesso")
        res.redirect("/aluno/atividades/cadastrar")
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Falha em cadastrar atividade complementar")
        res.redirect("/aluno/atividades/cadastrar")
    })
})

router.get("/atividades/exibir/:cod", loginAluno, (req, res) => {
    //Usuário atual
    database.select().from('aluno').where({
        login: req.user.login
    }).then((aluno) => {
        //Verifica se a atividade é do aluno
        database.select().from('atividade_complementar').where({
                rga_aluno: aluno[0].rga
            }).innerJoin('tipo_atividade',
                'tipo_atividade.cod_tipo_atividade', 'atividade_complementar.tipo_atividade')
            .where({
                cod_atividade: req.params.cod
            }).then((atividades) => {
                atividades.forEach((atividade) => {
                    atividade.data_inicio = atividade.data_inicio.getDate() + "/" + (parseInt(atividade.data_inicio.getMonth()) + 1) + "/" + atividade.data_inicio.getFullYear()
                    atividade.data_fim = atividade.data_fim.getDate() + "/" + (parseInt(atividade.data_fim.getMonth()) + 1) + "/" + atividade.data_fim.getFullYear()
                })
                database.select().from('aluno').innerJoin('atividade_complementar', 'aluno.rga',
                    'atividade_complementar.rga_aluno').innerJoin('documentacao', 'atividade_complementar.cod_atividade',
                    'documentacao.atv_complementar_cod').innerJoin('tipo_atividade', 'tipo_atividade.cod_tipo_atividade',
                    'atividade_complementar.tipo_atividade').innerJoin('tipo_participacao',
                    'tipo_participacao.cod_tipo_participacao', 'documentacao.tipo_participacao').where({
                    cod_atividade: req.params.cod
                }).then((documentos) => {
                    res.render("aluno/atividades/exibir", {
                        atividade: atividades[0],
                        documento: documentos
                    })
                })
            })
    })
})
//------------------------------------------------------------
router.get("/documentacoes", loginAluno, (req, res) => {
    database.select().from('aluno').where('login', req.user.login).then((aluno) => {
        database.select().from('documentacao').innerJoin('atividade_complementar',
                'atividade_complementar.cod_atividade', 'documentacao.atv_complementar_cod')
            .innerJoin('tipo_participacao', 'tipo_participacao.cod_tipo_participacao',
                'documentacao.tipo_participacao').where('rga_aluno', aluno[0].rga).then((data) => {
                res.render("aluno/documentacoes/documentacoes", {
                    documentacao: data
                })
            })
    })
})

router.get("/documentacoes/cadastrar", loginAluno, (req, res) => {
    database.select().from('aluno').where('login', req.user.login).then((aluno) => {
        database.select().from('atividade_complementar').where('rga_aluno', aluno[0].rga).innerJoin(
            'tipo_atividade', 'tipo_atividade.cod_tipo_atividade', 'atividade_complementar.tipo_atividade'
        ).then((atividades) => {
            res.render("aluno/documentacoes/cadastrar", {
                atividade: atividades
            })
        })
    })
})

router.post("/documentacoes/cadastrar", loginAluno, upload.single("anexo"), (req, res) => {
    var anexo = null;
    var path = require('path');
    var appDir = path.dirname(require.main.filename);
    console.log(appDir)

    if (req.file) {
        anexo = appDir + "/uploads/" + req.user.login + "_" + req.body.atv_complementar_cod + "_" +
            req.file.originalname
    }
    console.log(anexo)

    documento = {
        tipo_participacao: parseInt(req.body.tipo_participacao),
        data_inicio_participacao: req.body.data_inicio,
        data_fim_participacao: req.body.data_fim,
        atv_complementar_cod: parseInt(req.body.atv_complementar_cod),
        anexo: anexo
    }

    console.log(documento)

    database.insert(documento).into('documentacao').then((data) => {
        req.flash("success_msg", "Documentação cadastrada com sucesso")
        res.redirect("/aluno/documentacoes/cadastrar")
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Erro ao cadastrar documentação")
        res.redirect("/aluno/documentacoes/cadastrar")
    })

})

router.get('/documentacoes/exibir/:cod', loginAluno, (req, res) => {
    database.select().from('documentacao').innerJoin('atividade_complementar', 'documentacao.atv_complementar_cod',
        'atividade_complementar.cod_atividade').innerJoin('tipo_participacao', 'tipo_participacao.cod_tipo_participacao',
        'documentacao.tipo_participacao').innerJoin('tipo_atividade', 'tipo_atividade.cod_tipo_atividade',
        'atividade_complementar.tipo_atividade').where('cod_documentacao', req.params.cod).then((documento) => {
        documento[0].data_inicio_participacao = documento[0].data_inicio_participacao.getDate() + "/" + (parseInt(documento[0].data_inicio_participacao.getMonth()) + 1) + "/" + documento[0].data_inicio_participacao.getFullYear()
        documento[0].data_fim_participacao = documento[0].data_fim_participacao.getDate() + "/" + (parseInt(documento[0].data_fim_participacao.getMonth()) + 1) + "/" + documento[0].data_fim_participacao.getFullYear()
        res.render('aluno/documentacoes/exibir', {
            documentacao: documento[0]
        })
    })
})

router.get('/documentacoes/download/:cod', loginAluno, (req, res) => {
    database.select().from('documentacao').where({
        cod_documentacao: req.params.cod
    }).then((data) => {
        console.log(data[0].anexo)
        res.download(data[0].anexo);
    })
})

//------------------------------------------------------------
module.exports = router