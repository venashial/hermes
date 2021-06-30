exports.up = async (knex) => {
  await knex.schema.table('queue', function(table) {
    table.dropColumn('version_date')
  })
  await knex.schema.table('queue', function(table) {
    table.bigInteger('version_date').notNullable()
  })
};

exports.down = async (knex) => {
  await knex.schema.table('queue', function(table) {
    table.dropColumn('version_date')
  })
  await knex.schema.table('queue', function(table) {
    table.integer('version_date').notNullable()
  })
};
