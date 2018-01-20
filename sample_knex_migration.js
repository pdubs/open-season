
exports.up = function(knex, Promise) {
  return knex.schema
 .createTable('Segments', function (t) {
    t.increments('id').primary()
    t.integer('strava_id').unique()
    t.string('name').notNullable()
    t.string('city')
    t.string('state')
    t.string('created_at')
    t.integer('effort_count')
    t.integer('athlete_count')
    t.integer('distance')
    t.string('average_grade')
    t.integer('elevation_high')
    t.integer('elevation_low')
  })
  .createTable('Efforts', function (t2) {
    t2.increments('id').primary()
    t2.integer('segment_strava_id').references('strava_id').inTable('Segments')
    t2.string('athlete_name').notNullable().collate('utf8mb4_unicode_520_ci')
    t2.integer('elapsed_time')
    t2.integer('rank')
    t2.string('start_date_local')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('Efforts').dropTableIfExists('Segments')
};
