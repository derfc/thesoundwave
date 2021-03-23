const awsObject = require("../aws.js");
exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("song")
		.del()
		.then(async function () {
			// Inserts seed entries
			let result = await awsObject.getAwsObject();
			// console.log(result[1][1], "after return alb");
			return knex("song").insert(result[1][1]);
		});
};
