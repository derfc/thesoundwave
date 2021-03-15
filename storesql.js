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
	constructor(users, store, item, cart) {
		this.users = users;
		this.store = store;
		this.item = item;
		this.cart = cart;
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

	delCartItem(deleteID) {
		return knex(this.cart).where("id", deleteID).del();
	}
};
