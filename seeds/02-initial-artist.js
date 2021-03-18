exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("artist")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("artist").insert([
				{ id: 1, artist_name: "afrojack", artist_photo: "afrojack.jpg" },
				{ id: 2, artist_name: "troyboi", artist_photo: "troyboi.jpg" },
				{ id: 3, artist_name: "eason chan", artist_photo: "eason_chan.jpg" },
				{
					id: 4,
					artist_name: "jacky cheung",
					artist_photo: "jacky_cheung.jpg",
				},
				{
					id: 5,
					artist_name: "my little airport",
					artist_photo: "mla.jpg",
				},
			]);
		});
};
