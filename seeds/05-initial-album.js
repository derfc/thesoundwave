const awsObject = require("../aws.js");
exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("album")
		.del()
		.then(async function () {
			// Inserts seed entries
			let result = await awsObject.getAwsObject();
			// console.log(result[1][0], "after return alb");
			return knex("album").insert(result[1][0]);
		});
};
