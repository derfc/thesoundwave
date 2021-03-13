exports.up = function (knex) {
	return knex.schema.createTable("store", (table) => {
		table.increments();
		table.string("store_name").notNull();
		table.binary("store_photo");
		table.integer("artist_id").references("id").inTable("artist");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("store");
};
