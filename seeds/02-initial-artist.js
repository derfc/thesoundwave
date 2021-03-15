exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("artist")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("artist").insert([
				{ id: 1, artist_name: "afrojack", artist_photo: "afrojack.jpg" },
				{ id: 2, artist_name: "troyboi", artist_photo: "troyboi.jpg" },
			]);
		});
};
