module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      user: 'mytrips',
      database: 'mytrips'
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  }
}
