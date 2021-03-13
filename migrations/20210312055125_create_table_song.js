exports.up = function (knex) {
	return knex.schema.createTable("song", (table) => {
		table.increments();
		table.string("song_name").notNull();
		table.string("song_data").notNull();
		table.string("song_duration").notNull();
		table.integer("artist_id").references("id").inTable("artist");
		table.integer("album_id").references("id").inTable("album");
		table.integer("genre_id").references("id").inTable("genre");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("song");
};
