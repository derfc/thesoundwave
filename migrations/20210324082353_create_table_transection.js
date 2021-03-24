exports.up = function (knex) {
	return knex.schema.createTable("transection", (table) => {
		table.increments();
		table.integer("user_id").notNull().references("id").inTable("users");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("transection");
};
