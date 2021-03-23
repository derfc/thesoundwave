exports.seed = function (knex) {
	// Deletes ALL existing entries
	console.log("seed file 3");
	return knex("store")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("store").insert([
				{
					id: 1,
					store_name: "storeAfrojack",
					store_photo: "storeAfrojack.jpg",
					artist_id: 1,
				},
				{
					id: 2,
					store_name: "storeTroyboi",
					store_photo: "storeTroyboi.jpg",
					artist_id: 2,
				},
				{
					id: 3,
					store_name: "storeEasonChan",
					store_photo: "storeEasonChan.jpg",
					artist_id: 3,
				},
			]);
		});
};
