const awsObject = require("../aws.js");
exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("store")
		.del()
		.then(async function () {
			// Inserts seed entries
			let result = await awsObject.getAwsObject();
			return knex("store").insert(result[2]);
		});
};
