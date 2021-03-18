exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("album")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("album").insert([
				{
					id: 1,
					album_name: "H3M",
					album_photo:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/h3m.jpg",
					artist_id: 3,
				},
				{
					id: 2,
					album_name: "不老的傳說",
					album_photo:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E4%B8%8D%E8%80%81%E7%9A%84%E5%82%B3%E8%AA%AA/age_no_more.jpg",
					artist_id: 4,
				},
				{
					id: 3,
					album_name: "香港是個大商場",
					album_photo:
						"https://thesoundwave.s3-us-west-1.amazonaws.com/%E9%A6%99%E6%B8%AF%E6%98%AF%E5%80%8B%E5%A4%A7%E5%95%86%E5%A0%B4/Hong_Kong_is_One_Big_Shopping_Mall.jpg",
					artist_id: 5,
				},
			]);
		});
};
