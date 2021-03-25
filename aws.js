const aws = require("aws-sdk");
const keys = require("./config/keys");

module.exports.getAwsObject = () => {
	let artistArr = [];
	let albumArr = [];
	let storeArr = [];
	let artistKnex = [];
	let albumKnex = [];
	let songKnex = [];
	let storeKnex = [];
	let itemKnex = [];

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
			if (objArr[1] && objArr[1].endsWith(".jpg")) {
				if (!artistArr.includes(objArr[0])) {
					// console.log("new artist, push to arr", objArr[0]);
					// console.log(objArr[0].split("-"));
					let artistNameEng = objArr[0].split("-")[0].replace(/_/g, " ");
					let artistNameChi = objArr[0].split("-")[1];
					artistArr.push(objArr[0]);
					// console.log(artistArr, "artistArr 1");
					if (artistNameChi) {
						await artistKnex.push({
							artist_name_eng: artistNameEng,
							artist_name_chi: artistNameChi,
							artist_photo: `https://thesoundwave.s3-us-west-1.amazonaws.com/${objArr[0]}/${objArr[1]}`,
						});
					} else {
						await artistKnex.push({
							artist_name_eng: artistNameEng,
							artist_photo: `https://thesoundwave.s3-us-west-1.amazonaws.com/${objArr[0]}/${objArr[1]}`,
						});
					}
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
				// !albumArr.includes(objArr[1]) &&
				!albumArr.includes(objArr[2])
			) {
				albumArr.push(objArr[2]);
			}
		}
		console.log("5times");
		// console.log(albumArr, "i dont want numbers");
		return;
		return albumKnex;
	};

	const insertSong = async () => {
		let awsObj = await getAll();
		// console.log("calling insertsong ");
		for (let i = 0; i < awsObj.length; i++) {
			let objArr = awsObj[i].Key.split("/");
			// console.log(objArr, "working");
			if (objArr[3] && objArr[3].endsWith(".mp3")) {
				// console.log(objArr[3], "am i here?");
				let artistId = (await artistArr.indexOf(objArr[0])) + 1;
				let albumId = (await albumArr.indexOf(objArr[2])) + 1;
				await songKnex.push({
					song_name: objArr[3].replace(".mp3", ""),
					song_url: `https://thesoundwave.s3-us-west-1.amazonaws.com/${objArr[0]}/album/${objArr[2]}/${objArr[3]}`,
					artist_id: artistId,
					album_id: albumId,
				});
			}
			if (objArr[3] && objArr[1] == "album" && objArr[3].endsWith(".jpg")) {
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

	const insertStore = async () => {
		let awsObj = await getAll();
		for (let i = 0; i < awsObj.length; i++) {
			let objArr = awsObj[i].Key.split("/");
			// console.log(objArr[1], "here");
			let artistNameEng = objArr[0].split("-")[0].replace(/_/g, " ");
			if (
				objArr[1] &&
				objArr[2] &&
				objArr[1] == "store" &&
				// !albumArr.includes(objArr[1]) &&
				!storeArr.includes(`${artistNameEng}'s Store`)
			) {
				storeArr.push(`${artistNameEng}'s Store`);
				let artistId = (await artistArr.indexOf(objArr[0])) + 1;
				await storeKnex.push({
					store_name: `${artistNameEng}'s Store`,
					artist_id: artistId,
				});
			}
		}
		return storeKnex;
	};

	const insertItem = async () => {
		let awsObj = await getAll();
		for (let i = 0; i < awsObj.length; i++) {
			let objArr = awsObj[i].Key.split("/");
			// console.log(objArr[1], "here");
			// console.log(objArr[0], "bug");
			let artistNameEng = objArr[0].split("-")[0].replace(/_/g, " ");
			// console.log(objArr[0].split("-")[0].replace(/_/g, " "), "bug");
			if (
				objArr[2] &&
				objArr[3] &&
				objArr[1] == "store"
				// !albumArr.includes(objArr[1]) &&
				// !storeArr.includes(`${artistNameEng}'s Store`)
			) {
				let storeId = (await storeArr.indexOf(`${artistNameEng}'s Store`)) + 1;

				let itemCat = objArr[3].split("[category]")[0];
				// console.log("can run here");
				// console.log(objArr[3].split("[category]"));
				let itemName = objArr[3]
					.split("[category]")[1]
					.replace(".jpg", "")
					.replace(/_/g, " ");
				// console.log("cannot run here");
				await itemKnex.push({
					item_name: itemName,
					item_photo: `https://thesoundwave.s3-us-west-1.amazonaws.com/${objArr[0]}/store/${objArr[2]}/${objArr[3]}`,
					item_price: objArr[2],
					store_id: storeId,
					item_category: itemCat,
				});
			}
		}
		return itemKnex;
	};

	return insertArtist().then((artistKnex) => {
		return insertAlbum().then(() => {
			return insertSong().then((albumSongKnex) => {
				return insertStore().then((storeKnex) => {
					return insertItem().then((itemKnex) => {
						// console.log(itemKnex, "trytry");
						return [artistKnex, albumSongKnex, storeKnex, itemKnex];
					});
				});
			});
		});
	});
};
