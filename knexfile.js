module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      user: 'postgres',
      database: 'travis_ci_test'
    }
  },
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
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations'
    }
  }
}
