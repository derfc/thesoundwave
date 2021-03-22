const aws = require("aws-sdk");
const keys = require("./config/keys");

module.exports.getAwsObject = () => {
	let artistArr = [];
	let albumArr = [];
	let storeArr = [];
	let artistKnex = [];
	let albumKnex = [];
	let songKnex = [];
	const getAll = async () => {
		return await (async function () {
			try {
				aws.config.setPromisesDependency();
				aws.config.update({
					accessKeyId: keys.accessKeyId,
					secretAccessKey: keys.secretAccessKey,
					region: "us-west-1",
				});
				const s3 = new aws.S3();
				const response = await s3
					.listObjectsV2({
						Bucket: "thesoundwave",
					})
					.promise();
				// console.log(response);
				// console.log("-------------------------------------------");
				return response.Contents;
			} catch (e) {
				console.log("error", e);
			}
			debugger;
		})();
	};
	// return getArtist();
	const insertArtist = async () => {
		let awsObj = await getAll();
		for (let i = 0; i < awsObj.length; i++) {
			let objArr = awsObj[i].Key.split("/");
			// console.log(objArr[0]);
			if (!artistArr.includes(objArr[0])) {
				console.log("new artist, push to arr", objArr[0]);
				console.log(objArr[0].split("-"));
				artistArr.push(objArr[0]);
				console.log(artistArr.indexOf(objArr[0]) + 1, "i want this");
				console.log(
					`{ id: ${artistArr.indexOf(objArr[0]) + 1}, artist_name: "${
						objArr[0]
					}", artist_photo: "afrojack.jpg" }`
				);
			}
		}
		return artistArr;
	};

	const insertAlbum = async () => {
		let awsObj = await getAll();
		for (let i = 0; i < awsObj.length; i++) {
			let objArr = awsObj[i].Key.split("/");
			// console.log(objArr[1], "here");
			if (
				objArr[1] &&
				objArr[2] &&
				objArr[1] == "album" &&
				!albumArr.includes(objArr[1]) &&
				!albumArr.includes(objArr[2])
			) {
				// console.log("new album, push to arr", objArr[2]);
				albumArr.push(objArr[2]);

				// albumArr.push(objArr[1]);
			}
		}
		return albumArr;
	};

	const insertSong = async () => {
		let awsObj = await getAll();
		for (let i = 0; i < awsObj.length; i++) {
			let objArr = awsObj[i].Key.split("/");
			// console.log(objArr, "working");
			if (objArr[3] && objArr[3].endsWith(".mp3")) {
				// console.log(objArr[3]);
				// songKnex.push(
				// 	`{id: 1,song_name: "Allegro, Opus 3.3 am", song_url:"https://thesoundwave.s3-us-west-1.amazonaws.com/h3m/Eason+Chan+%E9%99%B3%E5%A5%95%E8%BF%85+Allegro%2C+Opus+3.3+am+MV.mp3",artist_id: 3,album_id: 1,genre_id: 1,}`
				// );
			}
		}
	};

	return Promise.all([insertArtist(), insertAlbum(), insertSong()]).then(
		(value) => {
			console.log(value, "ok ok ok ok");
			return value;
		}
	);
};

// module.exports = class AWSObject {
// 	constructor(hi) {
// 		this.trying = hi;
// 	}
// 	async try() {
// 		console.log("ok");
// 		return await (async function () {
// 			try {
// 				aws.config.setPromisesDependency();
// 				aws.config.update({
// 					accessKeyId: keys.accessKeyId,
// 					secretAccessKey: keys.secretAccessKey,
// 					region: "us-west-1",
// 				});
// 				const s3 = new aws.S3();
// 				const response = await s3
// 					.listObjectsV2({
// 						Bucket: "thesoundwave",
// 					})
// 					.promise();
// 				console.log(response);
// 				console.log("-------------------------------------------");
// 				return response.Contents;
// 			} catch (e) {
// 				console.log("error", e);
// 			}
// 			// debugger;
// 		})();
// 	}
// };
