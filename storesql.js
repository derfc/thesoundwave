require("dotenv").config();
const knex = require("knex")({
	client: "postgresql",
	connection: {
		database: process.env.db_name,
		user: process.env.db_username,
		password: process.env.db_password,
	},
});

module.exports = class StoreSQL {
	constructor(
		users,
		store,
		item,
		cart,
		song,
		artist,
		library,
		playlist,
		album,
		transection,
		orderDetail
	) {
		this.users = users;
		this.store = store;
		this.item = item;
		this.cart = cart;
		this.song = song;
		this.artist = artist;
		this.library = library;
		this.playlist = playlist;
		this.album = album;
		this.transection = transection;
		this.orderDetail = orderDetail;
	}

	selectUserName(user_id) {
		return knex(this.users).select("username").where("user_id", user_id);
	}
	selectArtistId(artistName) {
		return knex(this.artist)
			.select("id")
			.where("artist_name_eng", `${artistName}`);
	}
	selectStoreId(storeName) {
		return knex(this.store).select("id").where("store_name", `${storeName}`);
	}
	//
	getStoreItem(store_id) {
		if (store_id) {
			return knex(this.item).where("store_id", store_id);
		} else {
			return knex(this.item).orderBy("store_id").orderBy("store_id");
		}
	}

	getItemPrice(item_id) {
		return knex(this.item).select("item_price").where("id", item_id);
	}

	getCartItem(user_id) {
		// return knex(this.cart).where("user_id", user_id).orderBy("item_id");
		return knex(this.item)
			.orderBy("id")
			.whereIn("id", function () {
				return this.select("item_id").from("cart").where("user_id", user_id);
			});
	}
	addToCart(user_id, item_id) {
		return knex(this.cart).insert({ user_id: user_id, item_id: item_id });
	}
	//
	updateNotes(updateNote, updateID) {
		return knex(this.notes).update("notes", updateNote).where("id", updateID);
	}

	delCartItem(user_id, delete_item) {
		return knex(this.cart)
			.where("user_id", user_id)
			.andWhere("item_id", delete_item)
			.del();
	}

	getAllSong() {
		return knex
			.select([
				"s.id",
				"s.song_name",
				"s.song_url",
				"a.id as artist_id",
				"a.artist_name_eng",
				"a.artist_name_chi",
				"alb.album_photo",
			])
			.from(`song as s`)
			.join(`artist as a`, "s.artist_id", "a.id")
			.join(`album as alb`, "s.album_id", "alb.id");
		// .orderBy("id");
		// return knex
		// 	.from(this.song)
		// 	.join(this.artist, "song.artist_id", "artist.id");
	}

	getSongById(song_id) {
		// return knex(this.song).where("id", song_id).orderBy("id");
		return knex
			.select([
				"s.id",
				"s.song_name",
				"s.song_url",
				"a.id as artist_id",
				"a.artist_name_eng",
				"a.artist_name_chi",
				"alb.id as album_id",
				"alb.album_name",
			])
			.from(`song as s`)
			.join(`artist as a`, "s.artist_id", "a.id")
			.join(`album as alb`, "s.album_id", "alb.id")
			.where("s.id", song_id)
			.orderBy("id");
	}

	getSongByPlaylist(library_id) {
		return knex(this.playlist).where("library_id", library_id).orderBy("id");
	}

	getPlaylist(user_id) {
		return knex(this.library).where("user_id", user_id).orderBy("id");
	}

	addPlaylist(newPlaylistName, user_id) {
		return knex(this.library)
			.insert({
				playlist_name: `${newPlaylistName}`,
				user_id: user_id,
			})
			.returning("id");
	}

	delAllSongsInPlaylist(deleteId) {
		return knex(this.playlist).where("library_id", deleteId).del();
	}

	delPlaylistInLibrary(deleteId) {
		return knex(this.library).where("id", deleteId).del();
	}

	delOneSongInPlaylist(libraryId, deleteSongId) {
		return knex(this.playlist)
			.where("library_id", libraryId)
			.andWhere("song_id", deleteSongId)
			.del();
	}
	searchSongInPlaylist(libraryId, addSongId) {
		return knex(this.playlist)
			.where("library_id", libraryId)
			.andWhere("song_id", addSongId)
			.orderBy("id");
	}
	addSongToPlaylist(libraryId, addSongId) {
		return knex(this.playlist).insert({
			library_id: libraryId,
			song_id: addSongId,
		});
	}

	searchForArtist(keywords) {
		if (!keywords) {
			return knex(this.artist);
		}
		return knex(this.artist)
			.where("artist_name_eng", "ilike", `%${keywords}%`)
			.orWhere("artist_name_chi", "ilike", `%${keywords}%`);
	}

	searchForAlbum(keywords) {
		if (!keywords) {
			return knex(this.album);
		}
		return knex(this.album).where("album_name", "ilike", `%${keywords}%`);
	}

	searchForSong(keywords) {
		return knex(this.song).where("song_name", "ilike", `%${keywords}%`);
	}

	getArtist(artist_id) {
		if (!artist_id) {
			return knex(this.artist);
		} else {
			return knex(this.artist).where("id", artist_id);
		}
	}

	getAlbumByArtist(artist_id) {
		return knex(this.album).where("artist_id", artist_id);
	}

	getAlbum(album_id) {
		if (!album_id) {
			// return knex(this.album);
			return knex
				.select([
					"s.id",
					"s.album_name",
					"s.album_photo",
					"a.id as artist_id",
					"a.artist_name_eng",
					"a.artist_name_chi",
				])
				.from(`album as s`)
				.join(`artist as a`, "s.artist_id", "a.id")
				.orderBy("id");
		} else {
			return knex
				.select([
					"s.id",
					"s.album_name",
					"s.album_photo",
					"a.id as artist_id",
					"a.artist_name_eng",
					"a.artist_name_chi",
				])
				.from(`album as s`)
				.join(`artist as a`, "s.artist_id", "a.id")
				.where("s.id", album_id);
		}
	}

	getSongByAlbum(album_id) {
		return knex
			.select([
				"s.id",
				"s.song_name",
				"s.song_url",
				"a.id as artist_id",
				"a.artist_name_eng",
				"a.artist_name_chi",
			])
			.from(`song as s`)
			.join(`artist as a`, "s.artist_id", "a.id")
			.where("s.album_id", album_id)
			.orderBy("id");
	}

	searchForStore(keywords) {
		if (!keywords) {
			return knex(this.store);
		} else {
			return knex(this.store).where("store_name", "ilike", `%${keywords}%`);
		}
	}

	searchForItem(keywords, sort, selectedCat) {
		if (!keywords && !selectedCat) {
			if (sort == "---") {
				return knex(this.item);
			} else if (sort == "$down") {
				return knex(this.item).orderBy("item_price", "desc");
			} else {
				return knex(this.item).orderBy("item_price", "asc");
			}
		}
		if (selectedCat) {
			if (sort == "---") {
				return knex(this.item)
					.where("item_name", "ilike", `%${keywords}%`)
					.andWhere(function () {
						for (let i = 0; i < selectedCat.length; i++) {
							this.orWhere("item_category", "ilike", `%${selectedCat[i]}%`);
						}
					});
			} else if (sort == "$down") {
				return knex(this.item)
					.where("item_name", "ilike", `%${keywords}%`)
					.andWhere(function () {
						for (let i = 0; i < selectedCat.length; i++) {
							this.orWhere("item_category", "ilike", `%${selectedCat[i]}%`);
						}
					})
					.orderBy("item_price", "desc");
			} else {
				return knex(this.item)
					.where("item_name", "ilike", `%${keywords}%`)
					.andWhere(function () {
						for (let i = 0; i < selectedCat.length; i++) {
							this.orWhere("item_category", "ilike", `%${selectedCat[i]}%`);
						}
					})
					.orderBy("item_price", "asc");
			}
		}
		if (sort == "---") {
			return knex(this.item).where("item_name", "ilike", `%${keywords}%`);
		} else if (sort == "$down") {
			return knex(this.item)
				.where("item_name", "ilike", `%${keywords}%`)
				.orderBy("item_price", "desc");
		} else {
			return knex(this.item)
				.where("item_name", "ilike", `%${keywords}%`)
				.orderBy("item_price", "asc");
		}
	}
	searchForCategory() {
		return knex(this.item).select("item_category");
	}

	getStoreName(store_id) {
		return knex(this.store).select("store_name").where("id", store_id);
	}

	addTransection(user_id) {
		return knex(this.transection)
			.insert({
				user_id: user_id,
			})
			.returning("id");
	}

	async addOrderDetail(transection_id, itemArr) {
		try {
			const data = itemArr.map((item) => {
				return {
					transection_id: transection_id,
					item_id: item.item_id,
					quantity: item.quantity,
				};
			});
			await knex(this.orderDetail).insert(data);
		} catch (err) {
			console.log(err, "from sql");
		}
	}
};
