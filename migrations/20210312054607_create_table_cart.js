exports.up = function (knex) {
	return knex.schema.createTable("cart", (table) => {
		table.increments();
		table.integer("user_id").references("id").inTable("users");
		table.integer("item_id").references("id").inTable("item");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("cart");
};
