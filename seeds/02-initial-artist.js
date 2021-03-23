const awsObject = require("../aws.js");
exports.seed = function (knex) {
	// Deletes ALL existing entries
	// console.log("seed file 2");
	return knex("artist")
		.del()
		.then(async function () {
			// Inserts seed entries
			// console.log("try");
			let result = await awsObject.getAwsObject();
			// console.log(result[0], "after return");
			return knex("artist").insert(result[0]);
		});
};
