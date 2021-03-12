exports.up = function (knex) {
	return knex.schema.createTable("artist", (table) => {
		table.increments();
		table.string("artist_name").notNull();
		table.binary("artist_photo");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("artist");
};
