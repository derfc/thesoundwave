exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("album")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("album").insert([
				{ id: 1, album_name: "H3M", album_photo: "h3m.jpg", artist_id: 3 },
			]);
		});
};
