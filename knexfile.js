// Update with your config settings.
// Conexão com banco de dados
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
        directory:__dirname + '/migrations'
      },
      seeds: {
        directory:__dirname + '/seeds'
      }  
  }
};
