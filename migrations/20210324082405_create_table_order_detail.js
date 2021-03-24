exports.up = function (knex) {
	return knex.schema.createTable("order_detail", (table) => {
		table.increments();
		table
			.integer("transection_id")
			.notNull()
			.references("id")
			.inTable("transection");
		table.integer("item_id").notNull().references("id").inTable("item");
		table.integer("quantity");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("order_detail");
};
