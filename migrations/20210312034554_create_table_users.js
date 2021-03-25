exports.up = function (knex) {
	return knex.schema.createTable("users", (table) => {
		table.increments();
		table.string("username").notNull();
		table.string("password");
		table.string("google_id");
		table.string("facebook_id");
		table.string("display_name").unique();
		table.binary("profile_pic");
		table.timestamps(false, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("users");
};
