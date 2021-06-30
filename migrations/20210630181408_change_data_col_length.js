exports.up = async (knex) => {
  await knex.schema.table('queue', function(table) {
    table.dropColumn('data')
    table.dropColumn('webhooks')
  })
  await knex.schema.table('queue', function(table) {
    table.string('data', 4096).notNullable()
    table.string('webhooks', 2048).notNullable()
  })
};

exports.down = async (knex) => {
  await knex.schema.table('queue', function(table) {
    table.dropColumn('data')
    table.dropColumn('webhooks')
  })
  await knex.schema.table('queue', function(table) {
    table.string('data').notNullable()
    table.string('webhooks').notNullable()
  })
};