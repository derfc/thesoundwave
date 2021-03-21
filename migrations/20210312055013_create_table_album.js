exports.up = function (knex) {
	return knex.schema.createTable("album", (table) => {
		table.increments();
		table.string("album_name").notNull();
		table.string("album_photo");
		table.integer("artist_id").references("id").inTable("artist");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("album");
};
