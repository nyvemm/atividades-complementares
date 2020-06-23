//Importação de Módulos
const express = require('express')
const router = express.Router()
const passport = require("passport")
const database = require("../config/database/knex")
const path = require("path")

//Verificação Login
const {
    loggedIn
} = require("../helpers/login")

const {
    loginProfessor
} = require("../helpers/professor")

//------------------------------------------------------------

//Rotas
router.get("/", loginProfessor, (req, res) => {
    database.select().from('professor').innerJoin('usuario',
        'usuario.login', 'professor.login').where('usuario.login',
        req.user.login).then((professor) => {
        res.render("professor", {
            professor: professor[0]
        })
    })
})

router.get("/alunos", loginProfessor, (req, res) => {
    database.select().from('aluno').innerJoin('usuario', 'aluno.login',
        'usuario.login').then((alunos) => {
        res.render("professor/alunos/alunos", {
            aluno: alunos
        })
    }).catch((err) => {
        console.log(err)
        req.flash("Erro interno")
        res.redirect("/professor")
    })
})

router.get("/alunos/exibir/:rga", loginProfessor, (req, res) => {
    database.select().from('aluno').innerJoin('usuario', 'aluno.login',
        'usuario.login').where({
        'rga': req.params.rga
    }).then((alunos) => {
        //
        database.select().from('aluno').innerJoin('atividade_complementar', 'aluno.rga',
            'atividade_complementar.rga_aluno').innerJoin('documentacao', 'atividade_complementar.cod_atividade',
            'documentacao.atv_complementar_cod').innerJoin('tipo_atividade', 'tipo_atividade.cod_tipo_atividade',
            'atividade_complementar.tipo_atividade').innerJoin('tipo_participacao',
            'tipo_participacao.cod_tipo_participacao', 'documentacao.tipo_participacao').where({
            rga: req.params.rga
        }).then((documentos) => {
            console.log(documentos)
            res.render("professor/alunos/exibir", {
                aluno: alunos[0],
                documento: documentos
            })
        })
    }).catch((err) => {
        console.log(err)
        req.flash("Erro interno")
        res.redirect("/professor")
    })
})

router.get("/alunos/remover/:rga", loginProfessor, (req, res) => {
    database('aluno').where({
        rga: req.params.rga
    }).del().then(() => {
        req.flash("success_msg", 'Aluno removido com sucesso')
        res.redirect("/professor/alunos")
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", 'Falha em remover aluno')
        res.redirect("/professor/alunos")
    })
})

router.get("/atividades", loginProfessor, (req, res) => {
    database.select().from('atividade_complementar').innerJoin('tipo_atividade',
            'tipo_atividade.cod_tipo_atividade', 'atividade_complementar.tipo_atividade')
        .innerJoin('aluno', 'aluno.rga', 'atividade_complementar.rga_aluno')
        .innerJoin('usuario', 'usuario.login', 'aluno.login').orderBy('cod_atividade', 'desc')
        .then((atividades) => {
            atividades.forEach((atividade) => {
                atividade.data_inicio = atividade.data_inicio.getDate() + "/" + (parseInt(atividade.data_inicio.getMonth()) + 1) + "/" + atividade.data_inicio.getFullYear()
                atividade.data_fim = atividade.data_fim.getDate() + "/" + (parseInt(atividade.data_fim.getMonth()) + 1) + "/" + atividade.data_fim.getFullYear()
            })
            res.render("professor/atividades/atividades", {
                atividade: atividades
            })
        })
})

router.get("/atividades/exibir/:cod", loginProfessor, (req, res) => {
    database.select().from('atividade_complementar').innerJoin('tipo_atividade',
            'tipo_atividade.cod_tipo_atividade', 'atividade_complementar.tipo_atividade')
        .innerJoin('aluno', 'aluno.rga', 'atividade_complementar.rga_aluno')
        .innerJoin('usuario', 'usuario.login', 'aluno.login')
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
                res.render("professor/atividades/exibir", {
                    atividade: atividades[0],
                    documento: documentos
                })
            })
        })
})

router.get("/documentacoes", loginProfessor, (req, res) => {
    database.select().from('documentacao').innerJoin('atividade_complementar',
            'atividade_complementar.cod_atividade', 'documentacao.atv_complementar_cod')
        .innerJoin('tipo_participacao', 'tipo_participacao.cod_tipo_participacao',
            'documentacao.tipo_participacao').innerJoin('aluno', 'aluno.rga',
            'atividade_complementar.rga_aluno').innerJoin('usuario',
            'usuario.login', 'aluno.login').then((data) => {
            res.render("professor/documentacoes/documentacoes", {
                documentacao: data
            })
        })
})

router.get('/documentacoes/exibir/:cod', loginProfessor, (req, res) => {
    database.select().from('documentacao').innerJoin('atividade_complementar', 'documentacao.atv_complementar_cod',
        'atividade_complementar.cod_atividade').innerJoin('tipo_participacao', 'tipo_participacao.cod_tipo_participacao',
        'documentacao.tipo_participacao').innerJoin('tipo_atividade', 'tipo_atividade.cod_tipo_atividade',
        'atividade_complementar.tipo_atividade').leftJoin('professor', 'professor.cpf_professor',
        'documentacao.professor_cpf').innerJoin('aluno', 'aluno.rga',
        'atividade_complementar.rga_aluno').where('cod_documentacao', req.params.cod).then((documento) => {

        console.log(documento)
        documento[0].data_inicio_participacao = documento[0].data_inicio_participacao.getDate() + "/" + (parseInt(documento[0].data_inicio_participacao.getMonth()) + 1) + "/" + documento[0].data_inicio_participacao.getFullYear()
        documento[0].data_fim_participacao = documento[0].data_fim_participacao.getDate() + "/" + (parseInt(documento[0].data_fim_participacao.getMonth()) + 1) + "/" + documento[0].data_fim_participacao.getFullYear()

        if (documento[0].situacao == 'Matriculado') {
            documento[0].modificar = true;
        } else {
            documento[0].modificar = null
        }

        database.select().from('professor').where('login', req.user.login).then((professor) => {
            res.render('professor/documentacoes/exibir', {
                documentacao: documento[0],
                professor: professor[0]
            })
        })

    })
})

router.get('/documentacoes/download/:cod', loginProfessor, (req, res) => {
    database.select().from('documentacao').where({
        cod_documentacao: req.params.cod
    }).then((data) => {
        console.log(data[0].anexo)
        res.download(data[0].anexo);
    })
})

router.post('/documentacao/avalia/:cod', loginProfessor, (req, res) => {
    console.log(req.body)
    database('documentacao').where('cod_documentacao', req.params.cod)
        .update(req.body).then(() => {
            req.flash("success_msg", "Aluno avaliado com sucesso")
            res.redirect('/professor/documentacoes/exibir/' + req.params.cod)
        }).catch((err) => {
            console.log(err)
            req.flash("Erro ao avaliar aluno")
            res.redirect('/professor/documentacoes/exibir/' + req.params.cod)
        })
})

//------------------------------------------------------------

router.get('/alunos/avaliacao', loginProfessor, (req, res) => {
    database.select(database.raw('fn_avaliacao()')).then((data) => {
        req.flash("success_msg", 'Alunos atualizados com sucesso')
        res.redirect("/professor/alunos")
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Falha ao atualiazr alunos")
        res.redirect("/professor/alunos")
    })
})

//------------------------------------------------------------
module.exports = router