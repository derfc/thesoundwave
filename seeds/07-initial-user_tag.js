exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("user_tag")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("user_tag").insert([{ id: 1, user_id: 1, genre_id: 1 }]);
		});
};
