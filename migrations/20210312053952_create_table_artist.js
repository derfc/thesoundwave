exports.up = function (knex) {
	return knex.schema.createTable("artist", (table) => {
		table.increments();
		table.string("artist_name_eng").notNull();
		table.string("artist_name_chi");
		table.string("artist_photo");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("artist");
};
