exports.up = function (knex) {
	return knex.schema.createTable("library", (table) => {
		table.increments();
		table.string("playlist_name").notNull();
		table.binary("playlist_photo");
		table.integer("user_id").references("id").inTable("users");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("library");
};
