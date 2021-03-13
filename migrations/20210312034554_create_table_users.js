exports.up = function (knex) {
	return knex.schema.createTable("users", (table) => {
		table.increments();
		table.string("username").notNull();
		table.string("password").notNull();
		table.binary("profile_pic");
		table.timestamps(false, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("users");
};
