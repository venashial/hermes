exports.up = function (knex) {
  return knex.schema.createTable('projects', function (table) {
    table.increments()
    table.specificType('project_id', 'character(8)').unique().notNullable()
    table.string('last_updated', 32).notNullable()
    table.specificType('last_version_id', 'character(8)').unique().notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('projects')
}
