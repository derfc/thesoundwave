const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const StoreSQL = require("./storesql");
let storeSQL = new StoreSQL(
	"users",
	"store",
	"item",
	"cart",
	"song",
	"artist",
	"library",
	"playlist",
	"album",
	"transection",
	"order_detail"
);

const app = express();
const port = 3000;
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
const keys = require("./config/keys");
const passport = require("passport");
const session = require("express-session");
const stripePublicKey = process.env.stripe_pk;
const stripeSecretKey = process.env.stripe_sk;
const stripe = require("stripe")(stripeSecretKey);

//cookie session
const cookieSession = require("cookie-session");
const { default: knex } = require("knex");

app.use(
	cookieSession({
		//1 day
		maxAge: 24 * 60 * 60 * 1000,
		keys: [keys.session.cookieKey],
	})
);

app.use(
	session({
		secret: "supersecret",
		resave: false,
		saveUninitialized: false,
	})
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//auth routes
app.use("/auth", authRoutes);

//handlebars
app.engine(
	"handlebars",
	handlebars({
		defaultLayout: "main",
		helpers: {
			add: function (a, b) {
				return a + b;
			},
			times: function (a, b) {
				return a * b;
			},
			divide: function (a, b) {
				return a / b;
			},
		},
	})
);
app.set("view engine", "handlebars");

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static files
app.use(express.static(__dirname + "/public"));

// get Picture and Name
let pic;
let user;
let user_id;

function getNamePic(req) {
	if (req.user.provider === "google") {
		pic = req.user._json.picture;
		user = req.user.displayName;
	} else if (req.user.provider === "facebook") {
		pic = req.user.photos[0].value;
		user = req.user.displayName;
	} else {
		user = req.user.username;
		pic = undefined;
	}
}

//authcheck
const authCheck = (req, res, next) => {
	if (req.isAuthenticated()) {
		getNamePic(req);
		console.log("He is allowed!");
		console.log(req.user.id, "looking for id");
		let googleFacebookId = req.user.id;
		return storeSQL.getUserIdFromGFB(googleFacebookId).then((userInfo) => {
			if (userInfo[0]) {
				console.log(userInfo[0], "give me id");
				console.log(userInfo[0].id, "give me id");
				user_id = userInfo[0].id;
				console.log(userInfo[0].display_name, "give me displayname");
				displayName = userInfo[0].display_name;
				return next();
			} else {
				return storeSQL.getUserId(googleFacebookId).then((userInfo) => {
					console.log(userInfo[0], "give me id");
					console.log(userInfo[0].id, "give me id");
					user_id = userInfo[0].id;
					console.log(userInfo[0].display_name, "give me displayname");
					displayName = userInfo[0].display_name;
					return next();
				});
			}
		});
	} else {
		res.redirect("/auth/login");
	}
};

//landing page
app.get("/", (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect("/home")
	}
	res.render("index");
});

//home route
app.get("/home", authCheck, (req, res) => {
	let id = req.user.id;
	// getNamePic(req);

	return storeSQL.getPlaylist(user_id).then((playlist) => {
		// console.log("PL outpout", playlist);
		storeSQL.getAllSong().then((songs) => {
			// console.log(
			// 	songs.sort(() => Math.random() - 0.5),
			// 	"almost"
			// );
			let randomSong = JSON.parse(JSON.stringify(songs));
			res.render("home", {
				playlistSongArr: songs,
				showOnlySongArr: randomSong
					.sort(() => Math.random() - 0.5)
					.slice(0, 60),
				playlist: playlist,
				layout: "dashboard",
				stripePublicKey: stripePublicKey,
				user: user,
				thumbnail: pic,
				displayName: displayName,
				searchScript: "./searchScript.js",
				honeMusicPlayer: "/musicplayer.js",
			});
		});
	});
});

//search
app.post("/home", authCheck, (req, res) => {
	let keywords = req.body.keywords;
	if (keywords == "artist") {
		return storeSQL.searchForArtist().then((artist) => {
			res.send({ artist: artist });
		});
	} else if (keywords == "album") {
		return storeSQL.searchForAlbum().then((album) => {
			res.send({ album: album });
		});
	} else {
		return storeSQL.searchForArtist(keywords).then((artist) => {
			storeSQL.searchForAlbum(keywords).then((album) => {
				storeSQL.searchForSong(keywords).then((song) => {
					storeSQL.getPlaylist(user_id).then((playlist) => {
						let searchResult = {
							artist: artist,
							album: album,
							song: song,
							playlist: playlist,
						};
						res.send(searchResult);
					});
				});
			});
		});
	}
});

app.post("/home/artist/:artist_id", authCheck, (req, res) => {
	let artist_id = req.params.artist_id;
	return storeSQL.getArtist(artist_id).then((artistInfo) => {
		console.log(artistInfo);
		storeSQL.getAlbumByArtist(artistInfo[0].id).then((album) => {
			let result = { artist: artistInfo, album: album };
			res.send(result);
		});
	});
});

app.post("/home/album/:album_id", authCheck, (req, res) => {
	let album_id = req.params.album_id;
	console.log(album_id, "geeez");
	return storeSQL.getAlbum(album_id).then((albumInfo) => {
		// console.log(albumInfo);
		storeSQL.getSongByAlbum(albumInfo[0].id).then((song) => {
			// console.log("haha", song);
			storeSQL.getPlaylist(user_id).then((playlist) => {
				// console.log("playlist", playlist);
				// song.push({ albumName: playlist });
				// console.log("haha", song);
				let result = {
					song: song,
					album: albumInfo,
					playlist: playlist,
				};
				res.send(result);
			});
		});
	});
});

//get playlist
app.get("/library/:library_id", authCheck, (req, res) => {
	console.log("hi", req.params.library_id);
	let library_id = req.params.library_id;
	let count = 0;
	let playlistSongArr = [];
	return storeSQL.getSongByPlaylist(library_id).then(async (playlistSongs) => {
		// console.log("PL id outpout", playlistSongs);
		if (playlistSongs.length !== 0) {
			// console.log("PL id outpout", playlistSongs.length);
			// console.log("PL id outpout", playlistSongs[0]);
			if (playlistSongs.length !== 0) {
				for (let i = 0; i < playlistSongs.length; i++) {
					let song_id = playlistSongs[i].song_id;
					await storeSQL.getSongById(song_id).then((song) => {
						// console.log("what is this type", song[0]);
						playlistSongArr.push(song[0]);
					});
				}
				// console.log(playlistSongArr, "i want to know the order");
				return storeSQL.getPlaylist(user_id).then((playlist) => {
					// console.log("PL outpout", playlist);
					return storeSQL.getPlaylistName(library_id).then((playlistName) => {
						// console.log(playlistSongArr);
						// console.log(playlistName, "playlistName");
						// console.log(user, "user");
						res.render("playlist", {
							playlistName: playlistName[0].playlist_name,
							layout: "dashboard",
							libraryId: library_id,
							playlist: playlist,
							playlistSongArr: playlistSongArr,
							stripePublicKey: stripePublicKey,
							css: "../css/index.css",
							user: user,
							thumbnail: pic,
							displayName: displayName,
							musicPlayerScript: "../musicplayer.js",
						});
					});
				});
			}
			// playlistSongs.forEach((playlistSong) => {
			// 	let song_id = playlistSong.song_id;
			// 	storeSQL.getSongById(song_id).then((song) => {
			// 		// console.log("what is this type", song[0]);
			// 		playlistSongArr.push(song[0]);
			// 		count++;
			// 		if (count == playlistSongs.length) {
			// 			// console.log("finally", playlistSongArr);
			// 			storeSQL.getPlaylist(user_id).then((playlist) => {
			// 				// console.log("PL outpout", playlist);
			// 				return storeSQL
			// 					.getPlaylistName(library_id)
			// 					.then((playlistName) => {
			// 						// console.log(playlistSongArr);
			// 						console.log(playlistName, "playlistName");
			// 						console.log(user, "user");
			// 						res.render("playlist", {
			// 							playlistName: playlistName[0].playlist_name,
			// 							layout: "dashboard",
			// 							libraryId: library_id,
			// 							playlist: playlist,
			// 							playlistSongArr: playlistSongArr,
			// 							stripePublicKey: stripePublicKey,
			// 							css: "../css/index.css",
			// 							user: user,
			// 							thumbnail: pic,
			// 							displayName: displayName,
			// 							musicPlayerScript: "../musicplayer.js",
			// 						});
			// 					});
			// 			});
			// 		}
			// 	});
			// });
		} else {
			storeSQL.getPlaylist(user_id).then((playlist) => {
				// console.log("PL outpout", playlist);
				res.render("playlist", {
					layout: "dashboard",
					playlist: playlist,
					stripePublicKey: stripePublicKey,
					user: user,
					thumbnail: pic,
					displayName: displayName,
					css: "../css/index.css",
					musicPlayerScript: "../musicplayer.js",
				});
			});
		}
	});
});

app.post("/library", authCheck, (req, res) => {
	// console.log("hello", req.body.playlistName);
	let newPlaylistName = req.body.playlistName;
	return storeSQL.addPlaylist(newPlaylistName, user_id).then((library_id) => {
		// console.log("hihihihi", library_id[0]);
		res.redirect(`/home`);
		// res.redirect(`/library/${library_id[0]}`);
	});
});

//add song to playlist
app.post("/playlist/:library_id/:song_id", authCheck, (req, res) => {
	let libraryId = req.params.library_id;
	let addSongId = req.params.song_id;
	// console.log("lid", libraryId);
	// console.log("asid", addSongId);
	return storeSQL.searchSongInPlaylist(libraryId, addSongId).then((result) => {
		if (result[0]) {
			// console.log("yes", result);
			res.send("already in playlist!");
		} else {
			storeSQL.addSongToPlaylist(libraryId, addSongId).then(() => {
				res.send("added to playlist!");
			});
		}
	});
});

//del playlist
app.delete("/library/:library_id", authCheck, (req, res) => {
	console.log("hello", req.params.library_id);
	let deleteId = req.params.library_id;
	return storeSQL.delAllSongsInPlaylist(deleteId).then(() => {
		storeSQL.delPlaylistInLibrary(deleteId).then(() => {
			res.send("playlist deleted");
		});
	});
});

//del song
app.delete("/playlist/:library_id/:song_id", authCheck, (req, res) => {
	let libraryId = req.params.library_id;
	let deleteSongId = req.params.song_id;
	console.log(libraryId, "lid");
	console.log(deleteSongId, "sdid");
	// console.log("hello PLID", libraryId);
	// console.log("hello SID", deleteSongId);
	return storeSQL
		.delOneSongInPlaylist(libraryId, deleteSongId)
		.then(() => res.send("song deleted"));
});

//setting route
app.get("/setting", authCheck, (req, res) => {
	console.log("get setting");
	console.log(user_id, "setting user id");
	console.log(displayName, "display name");
	return storeSQL.getPlaylist(user_id).then((playlist) => {
		res.render("setting", {
			layout: "dashboard",
			playlist: playlist,
			user: user,
			thumbnail: pic,
			displayName: displayName,
			settingScript: "./settingScript.js",
		});
	})

	// return storeSQL.getDisplayName(user_id).then((displayName) => {
	// 	console.log(displayName);
	// 	console.log(displayName[0].display_name, "display name");
	// 	res.render("setting", {
	// 		layout: "dashboard",
	// 		user: user,
	// 		thumbnail: pic,
	// 		displayName: displayName[0].display_name,
	// 		settingScript: "./settingScript.js",
	// 	});
	// });
});

//setting route
app.post("/setting", authCheck, (req, res) => {
	let showHistory = req.body.showHistory;
	let transectionId = req.body.transectionId;
	let desireDisplayName = req.body.desireDisplayName;
	let setToDefaultDisplayName = req.body.setToDefaultDisplayName;
	if (showHistory) {
		return storeSQL
			.getTransectionHistory(user_id)
			.then((transectionHistory) => {
				res.send(transectionHistory);
			});
	} else if (transectionId) {
		return storeSQL.getOrderDetail(transectionId).then((transectionDetail) => {
			console.log(transectionDetail);
			res.send(transectionDetail);
		});
	} else if (setToDefaultDisplayName) {
		return storeSQL.setToDefaultDisplayName(user_id).then(() => {
			console.log("set to default");
			res.send("set to default");
		});
	} else {
		// if ((desireDisplayName = "")) {
		// 	res.send("availabile");
		// }
		// console.log(desireDisplayName, "Desire Display Name post request");
		return storeSQL
			.checkDisplayName(desireDisplayName)
			.then((checkingResult) => {
				if (checkingResult[0]) {
					res.send("used");
				} else {
					res.send("availabile");
				}
			});
	}
});

app.put("/setting", authCheck, (req, res) => {
	console.log(typeof req.body.newDisplayName, "what is this");
	console.log("i am user", user_id);
	let newDisplayName = req.body.newDisplayName;
	console.log(newDisplayName, "changing to desire Display Name");
	return storeSQL
		.editDisplayName(user_id, newDisplayName)
		.then((display_name) => {
			console.log(display_name, "returning stuff");
			// res.render("setting", {
			// 	layout: "dashboard",
			// 	user: user,
			// 	thumbnail: pic,
			// 	displayName: display_name,
			// 	settingScript: "./settingScript.js",
			// });
			res.send("done editing");
		});
});

//store route
app.get("/store", authCheck, (req, res) => {
	let catArr = [];
	let count = 0;
	return storeSQL.getStoreItem().then((item) => {
		return storeSQL.searchForStore().then((allStore) => {
			return storeSQL.searchForCategory().then(async (result) => {
				// console.log(result[0].item_category);
				await result.forEach((cat) => {
					if (!catArr.includes(cat.item_category)) {
						catArr.push(cat.item_category);
					}
				});
				await console.log(catArr, "wow");
				await res.render("store", {
					item: item,
					layout: "dashboard",
					stripePublicKey: stripePublicKey,
					allStore: allStore,
					category: catArr,
					user: user,
					thumbnail: pic,
					displayName: displayName,
					storeScript: "./storeScript.js",
				});
			});
		});
	});
});

app.post("/store", authCheck, (req, res) => {
	let keywords = req.body.keywords;
	let sort = req.body.sort;
	let store_id = req.body.storeId;
	let selectedCat = req.body.selectedCat;
	console.log(req.body);
	// console.log(selectedCat, "what is this");
	if (store_id) {
		return storeSQL.getStoreItem(store_id).then((item) => {
			return storeSQL.getStoreName(store_id).then((storeName) => {
				console.log(storeName, "bkend");
				res.send({ item: item, storeName: storeName });
			});
		});
	}
	// return storeSQL.searchForStore().then((store) => {
	// 	res.send({ store: store });
	// });

	return storeSQL.searchForItem(keywords, sort, selectedCat).then((item) => {
		// console.log(item);
		let result = { item: item };
		res.send(result);
	});
});

//cart route
app.get("/cart", authCheck, (req, res) => {
	return storeSQL.searchForStore().then((allStore) => {
		return storeSQL.getCartItem(user_id).then((item) => {
			res.render("cart", {
				allStore: allStore,
				item: item,
				layout: "dashboard",
				stripePublicKey: stripePublicKey,
				user: user,
				thumbnail: pic,
				displayName: displayName,
			});
		});
	});
});

app.post("/cart", authCheck, (req, res) => {
	let item_id = req.body.item_id;
	// let user_id = req.body.user_id;
	return storeSQL.addToCart(user_id, item_id).then(() => {
		res.send("added to cart");
		// res.render("cart", {
		// 	layout: "dashboard",
		// 	stripePublicKey: stripePublicKey,
		// });
	});
});

app.post("/purchase", authCheck, (req, res) => {
	let total = 0;
	let count = 0;
	// console.log(req.body.items, "looks good");
	req.body.items.forEach((item) => {
		storeSQL.getItemPrice(item.item_id).then((data) => {
			total += data[0].item_price * item.quantity;
			count++;
			if (count === req.body.items.length) {
				console.log("charge below");
				stripe.charges
					.create({
						amount: total,
						source: req.body.stripeTokenId,
						currency: "usd",
					})
					.then(() => {
						console.log("charge successful");
						return storeSQL.addTransection(user_id).then((transection_id) => {
							console.log(transection_id, "transection_id");
							return storeSQL
								.addOrderDetail(transection_id[0], req.body.items)
								.then(() => {
									console.log("added into order detail");
									return storeSQL.clearCart(user_id).then(() => {
										console.log("cart cleared");
										res.json({ message: "successfully purchased" });
									});
								});
						});
					})
					.catch((err) => {
						console.log("charge fail", err);
						res.status(500).end();
					});
			}
		});
	});
});

app.delete("/cart/:user_id/:item_id", authCheck, (req, res) => {
	// let user_id = req.params.user_id;
	let delete_item = req.params.item_id;
	return storeSQL.delCartItem(user_id, delete_item).then(() => {
		return storeSQL.getCartItem(user_id).then((item) => {
			res.render("cart", {
				item: item,
				layout: "dashboard",
				stripePublicKey: stripePublicKey,
			});
		});
	});
});

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
