const knex = require('knex')({
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: "./dbs/sf-restaurants.db"
  }
});


export default knex;