exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("library")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("library").insert([
				{
					id: -3,
					playlist_name: "playlist 1",
					playlist_photo: "playlist_photo_1.jpg",
					user_id: 1,
				},
				{
					id: -2,
					playlist_name: "playlist 2",
					playlist_photo: "playlist_photo_2.jpg",
					user_id: 1,
				},
				{
					id: -1,
					playlist_name: "playlist 3",
					playlist_photo: "playlist_photo_3.jpg",
					user_id: 1,
				},
			]);
		});
};
