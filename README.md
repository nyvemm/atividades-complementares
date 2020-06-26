
# AGAC

Projeto desenvolvido para a disciplina de Laboratório De Banco de Dados do curso de Sistemas de Informação.


### Etmologia

AGAC é mnemônico de "Ambiente de Gerenciamento de Atividades".


## Motivação.

O processo de registro e avaliação de atividades complementares é todo feito de forma manualmente, isto é o aluno entrega as documentações para o professor e o mesmo tem que avaliar seu aproveitamento manualmente, nossa proposta é desenvolver um sistema que faça a automatização dessa tarefa para as duas partes.


# Configurando o Sistema

### Configurando o banco de dados:

Para configurar o banco de dados, foi utilizado o [PostgreSQL](https://www.postgresql.org/) e o sistema não funcionará se o mesmo não tiver instalado, para configurar o seu banco de dados altere o arquivo no diretório **config\database\knex.js**.

	const knex = require('knex')({
      client: 'pg',
      connection: {
          host: 'localhost',
          user: 'postgres',
          password: 'master',
          database: 'atv_complementares'
      }
	})

### Configurando o sistema de e-mail:

Para configurar o sistema de e-mail, altere o arquivo no diretório **config\email.js**.

	var transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      secureConnection: false,
      port: 587,
      auth: {
          user: "agac.ufms@hotmail.com",
          pass: "xxxxxxxxxxxxxxx"
      },
      tls: {
          ciphers: 'SSLv3'
      }
  	})


### Alterando diretório de uploads:

Para editar o diretório de uploads, altere o arquivo no diretório **routes\aluno.js**.

	const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, "uploads/")
      },
      filename: function (req, file, cb) {
          cb(null, req.user.login + "_" + req.body.atv_complementar_cod + "_" +
              file.originalname);
      }
	})

Também é necessário tratar a ser indexado no banco de dados.

	var anexo = null;
    var path = require('path');
    var appDir = path.dirname(require.main.filename);

    if (req.file) {
        anexo = appDir + "/uploads/" + req.user.login + "_" +
            req.body.atv_complementar_cod + "_" +
            req.file.originalname
    }
    
    
## Modelo do banco de dados
Para utilizar o software de forma adequada é necessário criar as tabelas em SQL.

#### Criação das tabelas:

[Script de Criação de Tabelas](https://drive.google.com/file/d/1OeOKlIRzVjbbfjnp4z90KDf1fnzBmw_y/view?usp=sharing)

#### Procedimentos armazenados e Triggers

[Script de Criação de Procedimentos armazenados e Triggers](https://drive.google.com/file/d/1bAKf3qgVHk9Fe97ClG_o4oVDcMlgQB2d/view?usp=sharing)

  
# Executando o sistema

Para executar o sistema, primeiramente é necessário ter a ferramenta [Node JS](https://nodejs.org/en/) instalada. No diretório do projeto, execute o seguinte comando:

	node app.js

Depois de fazer isso, o servidor será aberto. Para acessar o software acessse a URL:

	http://localhost:8081/

Então você será redirecionado para a tela de login.


# Tecnologias utilizadas

Para o desenvolvimento do projeto as seguintes utlizadas foram utilizadas.

- [Bootstrap](https://getbootstrap.com/)
- [brModelo](https://sourceforge.net/projects/brmodelo30/)
- [Node JS](https://www.pgadmin.org/) 
- [pgAdmin](https://www.pgadmin.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [VSCode](https://code.visualstudio.com/)

## Dependências do Node JS utilizadas
	
- body-parser 
- bcryptjs
- connect-flash
- express
- express-handlebars
- express-session
- knex
- multer
- nodemailer
- passport
- passport-local


## Autores

| [<img src="https://avatars1.githubusercontent.com/u/54725154?s=460&u=6626c12ab626d0f16278b11d2667e54c3219e3d1&v=4" width="115"><br><sub>@lopuri</sub>](https://github.com/lopuri) | [<img src="https://avatars2.githubusercontent.com/u/52974636?s=400&u=976ecdec8e41ac0859d007c6bc37cb46d2fcd69e&v=4" width="115"><br><sub>@marcostl2</sub>](https://github.com/marcostl2) |
|:-:|:-:|
