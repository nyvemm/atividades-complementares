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
        'usuario.login').orderBy('dt_cadastro', 'DESC').then((alunos) => {
        alunos.forEach((aluno) => {
            if (aluno.situacao == 'Matriculado') {
                aluno.azul = true
            } else if (aluno.situacao == 'Aprovado') {
                aluno.verde = true
            } else {
                aluno.vermelho = true
            }
        })
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

                if (atividade.situacao_atividade == 'Em análise') {
                    atividade.azul = true
                } else if (atividade.situacao_atividade == 'Aprovado') {
                    atividade.verde = true
                } else {
                    atividade.vermelho = true
                }
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
                if (atividades[0].situacao == 'Matriculado') {
                    atividades[0].modificar = true;
                } else {
                    atividades[0].modificar = null
                }
                database.select().from('professor').where('login', req.user.login).then((professor) => {
                    res.render("professor/atividades/exibir", {
                        atividade: atividades[0],
                        documento: documentos,
                        professor: professor[0]
                    })
                })
            })
        })
})


router.post('/atividades/avalia/:cod', loginProfessor, (req, res) => {
    database('atividade_complementar').where('cod_atividade', req.params.cod)
        .update(req.body).then(() => {
            req.flash("success_msg", "Atividade avaliado com sucesso")
            res.redirect('/professor/atividades/')
        }).catch((err) => {
            console.log(err)
            req.flash("Erro ao avaliar aluno")
            res.redirect('/professor/atividades/exibir/' + req.params.cod)
        })
})

router.post('/documentacoes/avalia/:cod', loginProfessor, (req, res) => {
    database('documentacao').where('cod_documentacao', req.params.cod)
        .update(req.body).then(() => {
            req.flash("success_msg", "Documentação avaliado com sucesso")
            res.redirect('/professor/documentacoes/')
        }).catch((err) => {
            console.log(err)
            req.flash("Erro ao avaliar aluno")
            res.redirect('/professor/documentacoes/exibir/' + req.params.cod)
        })
})

router.get("/documentacoes", loginProfessor, (req, res) => {
    database.select().from('documentacao').innerJoin('atividade_complementar',
            'atividade_complementar.cod_atividade', 'documentacao.atv_complementar_cod')
        .innerJoin('tipo_participacao', 'tipo_participacao.cod_tipo_participacao',
            'documentacao.tipo_participacao').innerJoin('aluno', 'aluno.rga',
            'atividade_complementar.rga_aluno').innerJoin('usuario',
            'usuario.login', 'aluno.login').then((data) => {
            data.forEach((documento) => {
                if (documento.situacao_documentacao == 'Aprovado') {
                    documento.verde = true
                } else if (documento.situacao_documentacao == 'Reprovado') {
                    documento.vermelho = true
                } else {
                    documento.azul = true
                }
            })
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


//------------------------------------------------------------

router.get('/alunos/avaliacao', loginProfessor, (req, res) => {
    database.select(database.raw('fn_avaliacao()')).then((data) => {
        req.flash("success_msg", 'Alunos atualizados com sucesso')
        res.redirect("/professor/alunos")
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Falha ao avaliar alunos")
        res.redirect("/professor/alunos")
    })
})

//------------------------------------------------------------

router.get('/relatorios', loginProfessor, (req, res) => {
    res.render("professor/relatorios")
})

router.get('/relatorios/alunos', loginProfessor, (req, res) => {
    database.select().from('aluno').innerJoin('usuario', 'aluno.login',
        'usuario.login').then((alunos) => {
        alunos.forEach((aluno) => {
            if (aluno.situacao == 'Matriculado') {
                aluno.azul = true
            } else if (aluno.situacao == 'Aprovado') {
                aluno.verde = true
            } else {
                aluno.vermelho = true
            }
        })
        res.render("professor/relatorios/aluno", {
            aluno: alunos
        })
    }).catch((err) => {
        console.log(err)
        req.flash("Erro interno")
        res.redirect("/professor")
    })
})

router.get("/relatorios/alunos/pesquisar", loginProfessor, (req, res) => {
    if (req.query.filter == 'semestre' || req.query.filter == 'ano_ingresso') {
        database.select().from('aluno').innerJoin('usuario', 'usuario.login', 'aluno.login')
            .where(req.query.filter, parseInt(req.query.query)).then((alunos) => {
                alunos.forEach((aluno) => {
                    if (aluno.situacao == 'Matriculado') {
                        aluno.azul = true
                    } else if (aluno.situacao == 'Aprovado') {
                        aluno.verde = true
                    } else {
                        aluno.vermelho = true
                    }
                })
                res.render("professor/relatorios/aluno", {
                    aluno: alunos
                })
            }).catch((err) => {
                console.log(err)
                req.flash("error_msg", "Falha ao pesquisar dados")
                res.redirect("/professor/relatorios/alunos")
            })
    } else {
        database.select().from('aluno').innerJoin('usuario', 'usuario.login', 'aluno.login')
            .whereRaw("POSITION(? IN ??)<>0", [req.query.query, req.query.filter]).then((alunos) => {
                alunos.forEach((aluno) => {
                    if (aluno.situacao == 'Matriculado') {
                        aluno.azul = true
                    } else if (aluno.situacao == 'Aprovado') {
                        aluno.verde = true
                    } else {
                        aluno.vermelho = true
                    }
                })
                res.render("professor/relatorios/aluno", {
                    aluno: alunos
                })
            }).catch((err) => {
                console.log(err)
                req.flash("error_msg", "Falha ao pesquisar dados")
                res.redirect("/professor/relatorios/alunos")
            })
    }
})


router.get("/relatorios/atividades/", loginProfessor, (req, res) => {
    database.select().from('atividade_complementar').innerJoin('tipo_atividade',
            'tipo_atividade.cod_tipo_atividade', 'atividade_complementar.tipo_atividade')
        .innerJoin('aluno', 'aluno.rga', 'atividade_complementar.rga_aluno')
        .innerJoin('usuario', 'usuario.login', 'aluno.login').orderBy('cod_atividade', 'desc')
        .then((atividades) => {
            atividades.forEach((atividade) => {
                atividade.data_inicio = atividade.data_inicio.getDate() + "/" + (parseInt(atividade.data_inicio.getMonth()) + 1) + "/" + atividade.data_inicio.getFullYear()
                atividade.data_fim = atividade.data_fim.getDate() + "/" + (parseInt(atividade.data_fim.getMonth()) + 1) + "/" + atividade.data_fim.getFullYear()

                if (atividade.situacao_atividade == 'Em análise') {
                    atividade.azul = true
                } else if (atividade.situacao_atividade == 'Aprovado') {
                    atividade.verde = true
                } else {
                    atividade.vermelho = true
                }
            })
            res.render("professor/relatorios/atividade", {
                atividade: atividades
            })
        })
})

router.get("/relatorios/atividades/pesquisar", loginProfessor, (req, res) => {
    database.select().from('atividade_complementar').innerJoin('tipo_atividade',
            'tipo_atividade.cod_tipo_atividade', 'atividade_complementar.tipo_atividade')
        .innerJoin('aluno', 'aluno.rga', 'atividade_complementar.rga_aluno')
        .innerJoin('usuario', 'usuario.login', 'aluno.login')
        .whereRaw("POSITION(? IN ??)<>0", [req.query.query, req.query.filter]).then((atividades) => {
            atividades.forEach((atividade) => {
                atividade.data_inicio = atividade.data_inicio.getDate() + "/" + (parseInt(atividade.data_inicio.getMonth()) + 1) + "/" + atividade.data_inicio.getFullYear()
                atividade.data_fim = atividade.data_fim.getDate() + "/" + (parseInt(atividade.data_fim.getMonth()) + 1) + "/" + atividade.data_fim.getFullYear()

                if (atividade.situacao_atividade == 'Em análise') {
                    atividade.azul = true
                } else if (atividade.situacao_atividade == 'Aprovado') {
                    atividade.verde = true
                } else {
                    atividade.vermelho = true
                }
            })
            res.render("professor/relatorios/atividade", {
                atividade: atividades
            })
        }).catch((err) => {
            req.flash("error_msg", "Falha ao pesquisar dados")
            res.redirect("/professor/relatorios/alunos")
        })
})

router.get("/relatorios/documentacoes", loginProfessor, (req, res) => {
    database.select().from('documentacao').innerJoin('atividade_complementar',
            'atividade_complementar.cod_atividade', 'documentacao.atv_complementar_cod')
        .innerJoin('tipo_participacao', 'tipo_participacao.cod_tipo_participacao',
            'documentacao.tipo_participacao').innerJoin('aluno', 'aluno.rga',
            'atividade_complementar.rga_aluno').innerJoin('usuario',
            'usuario.login', 'aluno.login').then((data) => {
            data.forEach((documento) => {
                if (documento.situacao_documentacao == 'Aprovado') {
                    documento.verde = true
                } else if (documento.situacao_documentacao == 'Reprovado') {
                    documento.vermelho = true
                } else {
                    documento.azul = true
                }
            })
            res.render("professor/relatorios/documentacao", {
                documentacao: data
            })
        })
})

router.get('/relatorios/documentacoes/pesquisar', loginProfessor, (req, res) => {
    if (req.query.filter == 'cod_documentacao') {
        console.log(req.query)
        console.log(parseInt(req.query.query))
        console.log('-------------------')
        database.select().from('documentacao').innerJoin('atividade_complementar',
                'atividade_complementar.cod_atividade', 'documentacao.atv_complementar_cod')
            .innerJoin('tipo_participacao', 'tipo_participacao.cod_tipo_participacao',
                'documentacao.tipo_participacao').innerJoin('aluno', 'aluno.rga',
                'atividade_complementar.rga_aluno').innerJoin('usuario',
                'usuario.login', 'aluno.login').where(req.query.filter, parseInt(req.query.query)).then((data) => {
                data.forEach((documento) => {
                    if (documento.situacao_documentacao == 'Aprovado') {
                        documento.verde = true
                    } else if (documento.situacao_documentacao == 'Reprovado') {
                        documento.vermelho = true
                    } else {
                        documento.azul = true
                    }
                })
                res.render("professor/relatorios/documentacao", {
                    documentacao: data
                })
            }).catch((err) => {
                console.log(err)
                req.flash("error_msg", "Falha ao pesquisar dados")
                res.redirect("/professor/relatorios/documentacoes")
            })
    } else {
        database.select().from('documentacao').innerJoin('atividade_complementar',
                'atividade_complementar.cod_atividade', 'documentacao.atv_complementar_cod')
            .innerJoin('tipo_participacao', 'tipo_participacao.cod_tipo_participacao',
                'documentacao.tipo_participacao').innerJoin('aluno', 'aluno.rga',
                'atividade_complementar.rga_aluno').innerJoin('usuario',
                'usuario.login', 'aluno.login').whereRaw("POSITION(? IN ??)<>0", [req.query.query, req.query.filter]).then((data) => {
                data.forEach((documento) => {
                    if (documento.situacao_documentacao == 'Aprovado') {
                        documento.verde = true
                    } else if (documento.situacao_documentacao == 'Reprovado') {
                        documento.vermelho = true
                    } else {
                        documento.azul = true
                    }
                })
                res.render("professor/relatorios/documentacao", {
                    documentacao: data
                })
            }).catch((err) => {
                console.log(err)
                req.flash("error_msg", "Falha ao pesquisar dados")
                res.redirect("/professor/relatorios/documentacoes")
            })
    }
})

router.get('/relatorios/aluno_semestre/', loginProfessor, (req, res) => {
    database.select().from('aluno').innerJoin('usuario', 'aluno.login',
        'usuario.login').whereRaw('CEIL(EXTRACT(MONTH FROM dt_cadastro)/ 6)+1 =\
        CEIL(EXTRACT(MONTH FROM CURRENT_DATE) / 6) + 1 ').then((alunos) => {
        alunos.forEach((aluno) => {
            if (aluno.situacao == 'Matriculado') {
                aluno.azul = true
            } else if (aluno.situacao == 'Aprovado') {
                aluno.verde = true
            } else {
                aluno.vermelho = true
            }
        })
        res.render("professor/relatorios/aluno_filter", {
            aluno: alunos
        })
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Falha ao pesquisar dados")
        res.redirect("/professor/relatorios")
    })
})

router.get('/relatorios/aluno_ano/', loginProfessor, (req, res) => {
    database.select().from('aluno').innerJoin('usuario', 'aluno.login',
        'usuario.login').whereRaw('EXTRACT(YEAR FROM dt_cadastro) = \
        EXTRACT(YEAR FROM CURRENT_DATE)').then((alunos) => {
        alunos.forEach((aluno) => {
            if (aluno.situacao == 'Matriculado') {
                aluno.azul = true
            } else if (aluno.situacao == 'Aprovado') {
                aluno.verde = true
            } else {
                aluno.vermelho = true
            }
        })
        res.render("professor/relatorios/aluno_filter", {
            aluno: alunos
        })
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Falha ao pesquisar dados")
        res.redirect("/professor/relatorios")
    })
})

router.get('/relatorios/atividade_data/', loginProfessor, (req, res) => {
    database.select().from('atividade_complementar').innerJoin('tipo_atividade',
            'tipo_atividade.cod_tipo_atividade', 'atividade_complementar.tipo_atividade')
        .innerJoin('aluno', 'aluno.rga', 'atividade_complementar.rga_aluno')
        .innerJoin('usuario', 'usuario.login', 'aluno.login')
        .then((atividades) => {
            atividades.forEach((atividade) => {
                atividade.data_inicio = atividade.data_inicio.getDate() + "/" + (parseInt(atividade.data_inicio.getMonth()) + 1) + "/" + atividade.data_inicio.getFullYear()
                atividade.data_fim = atividade.data_fim.getDate() + "/" + (parseInt(atividade.data_fim.getMonth()) + 1) + "/" + atividade.data_fim.getFullYear()

                if (atividade.situacao_atividade == 'Em análise') {
                    atividade.azul = true
                } else if (atividade.situacao_atividade == 'Aprovado') {
                    atividade.verde = true
                } else {
                    atividade.vermelho = true
                }
            })
            res.render("professor/relatorios/atividade_date", {
                atividade: atividades
            })
        }).catch((err) => {
            req.flash("error_msg", "Falha ao pesquisar dados")
            res.redirect("/professor/relatorios/")
        })
})

router.get("/relatorios/atividade-data/pesquisar", loginProfessor, (req, res) => {
    database.select().from('atividade_complementar').innerJoin('tipo_atividade',
            'tipo_atividade.cod_tipo_atividade', 'atividade_complementar.tipo_atividade')
        .innerJoin('aluno', 'aluno.rga', 'atividade_complementar.rga_aluno')
        .innerJoin('usuario', 'usuario.login', 'aluno.login')
        .whereRaw('data_inicio BETWEEN ? AND ?', [req.query.data_inicial, req.query.data_final])
        .then((atividades) => {
            atividades.forEach((atividade) => {
                atividade.data_inicio = atividade.data_inicio.getDate() + "/" + (parseInt(atividade.data_inicio.getMonth()) + 1) + "/" + atividade.data_inicio.getFullYear()
                atividade.data_fim = atividade.data_fim.getDate() + "/" + (parseInt(atividade.data_fim.getMonth()) + 1) + "/" + atividade.data_fim.getFullYear()

                if (atividade.situacao_atividade == 'Em análise') {
                    atividade.azul = true
                } else if (atividade.situacao_atividade == 'Aprovado') {
                    atividade.verde = true
                } else {
                    atividade.vermelho = true
                }
            })
            res.render("professor/relatorios/atividade_date", {
                atividade: atividades
            })
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Falha ao pesquisar dados")
            res.redirect("/professor/relatorios/")
        })
})
//------------------------------------------------------------
module.exports = router