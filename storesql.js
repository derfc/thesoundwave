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
		album
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
	}

	selectUserName(user_id) {
		return knex(this.users).select("username").where("user_id", user_id);
	}
	selectArtistId(artistName) {
		return knex(this.artist).select("id").where("artist_name", `${artistName}`);
	}
	selectStoreId(storeName) {
		return knex(this.store).select("id").where("store_name", `${storeName}`);
	}
	//
	getStoreItem(store_id) {
		if (store_id) {
			return knex(this.item).where("store_id", store_id).orderBy("store_id");
		} else {
			return knex(this.item).orderBy("store_id");
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
				"a.artist_name",
			])
			.from(`song as s`)
			.join(`artist as a`, "s.artist_id", "a.id");
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
				"a.artist_name",
			])
			.from(`song as s`)
			.join(`artist as a`, "s.artist_id", "a.id")
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

	delPlaylistSong(deleteID) {
		return knex(this.playlist).where("library_id", deleteID).del();
	}

	delPlaylistInLibrary(deleteID) {
		return knex(this.library).where("id", deleteID).del();
	}

	searchForArtist(keywords) {
		return knex(this.artist).where("artist_name", "like", `%${keywords}%`);
	}

	searchForAlbum(keywords) {
		return knex(this.album).where("album_name", "like", `%${keywords}%`);
	}

	searchForSong(keywords) {
		return knex(this.song).where("song_name", "like", `%${keywords}%`);
	}
};
