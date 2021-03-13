exports.up = function (knex) {
	return knex.schema.createTable("playlist", (table) => {
		table.increments();
		table.integer("library_id").references("id").inTable("library");
		table.integer("song_id").references("id").inTable("song");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("playlist");
};
