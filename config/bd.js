//arquivo de configuração com o banco de dados
const config = require('../knexfile.js')
//Inciciando o Knex
const knex = require('knex')(config)//chamada para outra função ou conexão

knex.migrate.latest([config])
module.exports = knex



