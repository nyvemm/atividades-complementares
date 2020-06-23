//Configurações do servidor

//------------------------------------------------------------
//Configuração do servidor local
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'master',
        database: 'atv_complementares'
    }
})

//------------------------------------------------------------
module.exports = knex