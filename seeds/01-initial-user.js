exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("users")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("users").insert([
				{
					id: 1,
					username: "root",
					password: "root",
					profile_pic: "profile_pic1.jpg",
				},
			]);
		});
};
