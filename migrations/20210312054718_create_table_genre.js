exports.up = function (knex) {
	return knex.schema.createTable("genre", (table) => {
		table.increments();
		table.string("genre_name").notNull();
		table.binary("genre_photo");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("genre");
};
