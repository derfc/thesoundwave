exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("item")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("item").insert([
				{
					id: 1,
					item_name: "afrojack-tee",
					item_photo: "afrojack-tee.jpg",
					item_price: 1299,
					item_describtion: "beautiful afrojack tee",
					item_stock: 100,
					store_id: 1,
				},
				{
					id: 2,
					item_name: "afrojack-hat",
					item_photo: "afrojack-hat.jpg",
					item_price: 1099,
					item_describtion: "beautiful afrojack hat",
					item_stock: 200,
					store_id: 1,
				},
				{
					id: 3,
					item_name: "afrojack-keychain",
					item_photo: "afrojack-keychain.jpg",
					item_price: 599,
					item_describtion: "beautiful afrojack keychain",
					item_stock: 300,
					store_id: 1,
				},
				{
					id: 4,
					item_name: "troyboi-tee",
					item_photo: "troyboi-tee.jpg",
					item_price: 1299,
					item_describtion: "beautiful troyboi tee",
					item_stock: 100,
					store_id: 2,
				},
				{
					id: 5,
					item_name: "troyboi-hat",
					item_photo: "troyboi-hat.jpg",
					item_price: 1099,
					item_describtion: "beautiful troyboi hat",
					item_stock: 200,
					store_id: 2,
				},
				{
					id: 6,
					item_name: "troyboi-keychain",
					item_photo: "troyboi-keychain.jpg",
					item_price: 599,
					item_describtion: "beautiful troyboi keychain",
					item_stock: 300,
					store_id: 2,
				},
			]);
		});
};
