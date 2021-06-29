exports.up = function (knex) {
  return knex.schema.createTable('webhooks', function (table) {
    table.increments()
    table.specificType('project_id', 'character(8)').notNullable()
    table.string('payload_url', 2048).notNullable()
    table.string('content_type', 32).notNullable()
    table.integer('failed_attempts').notNullable().defaultTo(0)
    table.string('config').notNullable().defaultTo('{}')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('webhooks')
}
