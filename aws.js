const aws = require("aws-sdk");
const keys = require("./config/keys");

module.exports.getAwsObject = () => {
	let artistArr = [];
	let albumArr = [];
	let storeArr = [];
	let artistKnex = [];
	let albumKnex = [];
	let songKnex = [];
	let albumPhotoKnex = [];
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
				// console.log("new artist, push to arr", objArr[0]);
				// console.log(objArr[0].split("-"));
				let artistNameEng = objArr[0].split("-")[0].replaceAll("_", " ");
				let artistNameChi = objArr[0].split("-")[1];
				artistArr.push(objArr[0]);
				// console.log(artistArr, "artistArr 1");
				if (artistNameChi) {
					await artistKnex.push({
						artist_name_eng: artistNameEng,
						artist_name_chi: artistNameChi,
						artist_photo: "#",
					});
				} else {
					await artistKnex.push({
						artist_name_eng: artistNameEng,
						artist_photo: "#",
					});
				}
			}
		}
		return artistKnex;
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
				// let artistId = (await artistArr.indexOf(objArr[0])) + 1;
				// console.log(objArr, "all");
				// console.log(artistId, "artist id 2");
				// console.log(artistArr, "artistArr 2");
				// console.log(objArr, "working on this");
				albumArr.push(objArr[2]);
				// console.log("jm9");
				// await albumKnex.push(
				// 	`{album_name: ${objArr[2]},album_photo:"#",artist_id: ${artistId},}`
				// );
				// albumArr.push(objArr[1]);
			}
		}
		return;
		return albumKnex;
	};

	const insertSong = async () => {
		let awsObj = await getAll();
		console.log("calling insertsong ");
		for (let i = 0; i < awsObj.length; i++) {
			let objArr = awsObj[i].Key.split("/");
			// console.log(objArr, "working");
			if (objArr[3] && objArr[3].endsWith(".mp3")) {
				// console.log(objArr[3], "am i here?");
				let artistId = (await artistArr.indexOf(objArr[0])) + 1;
				let albumId = (await albumArr.indexOf(objArr[2])) + 1;
				// console.log(artistId, "artist id 3");
				// console.log(artistArr, "artistArr 3");
				// console.log(albumId, "album id 3");
				// console.log(albumArr, "albumArr 3");
				await songKnex.push({
					song_name: objArr[3],
					song_url: `https://thesoundwave.s3-us-west-1.amazonaws.com/${objArr[0]}/album/${objArr[2]}/${objArr[3]}`,
					artist_id: artistId,
					album_id: albumId,
				});
			}
			if (objArr[3] && objArr[3].endsWith(".jpg")) {
				let artistId = (await artistArr.indexOf(objArr[0])) + 1;
				await albumKnex.push({
					album_name: objArr[2],
					album_photo: `https://thesoundwave.s3-us-west-1.amazonaws.com/${objArr[0]}/album/${objArr[2]}/${objArr[3]}`,
					artist_id: artistId,
				});
				// await albumPhotoKnex.push(
				// 	`{photo_url:"https://thesoundwave.s3-us-west-1.amazonaws.com/${objArr[0]}/album/${objArr[2]}/${objArr[3]}"}`
				// );
			}
		}
		return [albumKnex, songKnex];
	};

	return insertArtist().then((artistKnex) => {
		return insertAlbum().then(() => {
			return insertSong().then((albumSongKnex) => {
				return [artistKnex, albumSongKnex];
			});
		});
	});
};
