exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("genre")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("genre").insert([
				{ id: 1, genre_name: "genre_name", genre_photo: "genre_photo.jpg" },
			]);
		});
};
