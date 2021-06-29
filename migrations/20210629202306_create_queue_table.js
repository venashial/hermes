exports.up = function (knex) {
  return knex.schema.createTable('queue', function (table) {
    table.increments()
    table.specificType('project_id', 'character(8)').notNullable()
    table.string('data').notNullable()
    table.string('webhooks').notNullable()
    table.integer('version_date').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('queue')
}
