exports.up = function (knex) {
	return knex.schema.createTable("item", (table) => {
		table.increments();
		table.string("item_name").notNull();
		table.binary("item_photo");
		table.integer("item_price");
		table.string("item_describtion");
		table.integer("item_stock");
		table.integer("store_id").references("id").inTable("store");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("item");
};
