exports.up = function (knex) {
	return knex.schema.createTable("user_tag", (table) => {
		table.increments();
		table.integer("user_id").references("id").inTable("users");
		table.integer("genre_id").references("id").inTable("genre");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("user_tag");
};
