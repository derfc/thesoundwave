const awsObject = require("../aws.js");
// const awsObj = new AWSObject("test here");
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	console.log("try");
	let result = await awsObject.getAwsObject();
	console.log(result, "before return");
	// await (async function () {
	// 	try {
	// 		aws.config.setPromisesDependency();
	// 		aws.config.update({
	// 			accessKeyId: keys.accessKeyId,
	// 			secretAccessKey: keys.secretAccessKey,
	// 			region: "us-west-1",
	// 		});
	// 		const s3 = new aws.S3();
	// 		const response = await s3
	// 			.listObjectsV2({
	// 				Bucket: "thesoundwave",
	// 			})
	// 			.promise();
	// 		console.log(response);
	// 		console.log("-------------------------------------------");

	// 		return knex("users")
	// 			.del()
	// 			.then(async function () {
	// 				console.log(response, "doneeeee");
	// 				// Inserts seed entries
	// 				return knex("users").insert([
	// 					{
	// 						id: 1,
	// 						username: "root",
	// 						password: "root",
	// 						profile_pic: "profile_pic1.jpg",
	// 					},
	// 				]);
	// 			});
	// 	} catch (e) {
	// 		console.log("error", e);
	// 		return;
	// 	}
	// 	// debugger;
	// })();

	return knex("users")
		.del()
		.then(async function () {
			// Inserts seed entries
			// let result = await awsObj.try();

			// console.log(result[0].Key, "hi");
			return knex("users").insert([
				{
					id: 1,
					username: "result[0].Key",
					password: "root",
					profile_pic: "profile_pic1.jpg",
				},
			]);
		});
};
