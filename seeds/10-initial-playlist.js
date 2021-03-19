exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("playlist")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("playlist").insert([
				{ id: 1, library_id: 1, song_id: 1 },
				{ id: 2, library_id: 1, song_id: 2 },
				{ id: 3, library_id: 1, song_id: 3 },
				{ id: 4, library_id: 2, song_id: 4 },
				{ id: 5, library_id: 2, song_id: 5 },
				{ id: 6, library_id: 2, song_id: 6 },
				{ id: 7, library_id: 3, song_id: 7 },
				{ id: 8, library_id: 3, song_id: 8 },
				{ id: 9, library_id: 3, song_id: 9 },
			]);
		});
};
