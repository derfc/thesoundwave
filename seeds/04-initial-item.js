const awsObject = require("../aws.js");
exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("item")
		.del()
		.then(async function () {
			// Inserts seed entries
			let result = await awsObject.getAwsObject();
			return knex("item").insert(result[3]);
		});
};
