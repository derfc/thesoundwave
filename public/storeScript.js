let selectedCat = [];
$("#sort").on("change", function (e) {
	clearAll();
	let sort = e.target.value;
	let keywords = $("#filter_store")[0].value;
	// console.log(keywords, sort);
	fireSearch(keywords, sort, selectedCat);
});

$("#filter_store").on("keyup search", function (e) {
	// console.log($("#sort")[0].value);
	// console.log("hello", e.target.value);
	clearAll();
	let keywords = e.target.value;
	let sort = $("#sort")[0].value;
	// console.log("what is this", selectedCat);
	fireSearch(keywords, sort, selectedCat);
});
$(".clear-search").click((e) => {
	e.preventDefault();
	clearAll();
	$(".noneWhenSearch")[0].style.display = "block";
	$(".noneWhenSearch")[1].style.display = "block";
});

$(".search-category").click((e) => {
	clearAll();
	let category = e.target.value;

	if (!selectedCat.includes(category)) {
		selectedCat.push(category);
		// console.log(selectedCat);
		$(`#category-${category}`).attr(
			"class",
			"btn btn-danger button-store search-category"
		);
	} else {
		let targetIndex = selectedCat.indexOf(category);
		selectedCat.splice(targetIndex, 1);
		// console.log(selectedCat);
		$(`#category-${category}`).attr(
			"class",
			"btn button-store search-category"
		);
	}
	let keywords = $("#filter_store")[0].value;
	let sort = $("#sort")[0].value;
	if (!keywords && selectedCat.length == 0) {
		clearAll();
		$(".noneWhenSearch")[0].style.display = "block";
		$(".noneWhenSearch")[1].style.display = "block";
	} else {
		fireSearch(keywords, sort, selectedCat);
	}
});

$(".select-store").click((e) => {
	// console.log(e.target.dataset.store_id);
	let storeId = e.target.dataset.store_id;
	let storeName = e.target.value;
	clearAll();
	searchStore(storeId, storeName);
});

const clearAll = () => {
	$(".store").empty();
	$(".item").empty();
	$(".noneWhenSearch")[0].style.display = "none";
	$(".noneWhenSearch")[1].style.display = "none";
};

const appendStore = (result) => {
	for (let i = 0; i < result.store.length; i++) {
		let storeName = result.store[i].store_name;
		let storePhoto = result.store[i].store_photo;
		let storeId = result.store[i].id;
		$(".store").append(
			`<button class="go-to-store" data-store_id ="${storeId}">${storeName}</button></br>`
		);
	}
};

const appendItem = (result) => {
	// console.log(result);
	$(".item").append('<div class="item-inside px-4 row"></div>');
	for (let i = 0; i < result.item.length; i++) {
		let itemName = result.item[i].item_name;
		let itemPhoto = result.item[i].item_photo;
		let itemPrice = result.item[i].item_price;
		let itemId = result.item[i].id;
		$(".item-inside").append(
			`
			<div class="col-lg-2 col-md-3 col-sm-4 my-3">
			<div class="album-img">
			<img class="image img-fluid" src=${itemPhoto} alt="${itemName} Photo"/>
			</div>
			<div class="item-info">
			<h6 class="name mt-2">${itemName}</h6>
			<h6 class="name mt-2">$${itemPrice / 100}</h6>
			<button class="btn add-to-cart py-0" data-item_id ="${itemId}" data-user_id="1"><i data-item_id ="${itemId}" class="fal fa-shopping-cart"></i>add to cart</button>
			</div>
			</div>
			`
		);
	}
	$(".add-to-cart").click((e) => {
		e.preventDefault();
		let item_id = e.target.dataset.item_id;
		let user_id = e.target.dataset.user_id;
		// console.log(item_id, "iid");
		// console.log(user_id, "uid");

		$.ajax({
			type: "POST",
			url: `/cart`,
			data: { item_id: item_id, user_id: user_id },
			success: function () {
				console.log("success");
			},
		})
			.done(function (data) {
				// console.log(data);
			})
			.fail(function () {
				console.log("failed");
			})
			.always(() => console.log("running"));
	});
};

const fireSearch = (keywords, sort, selectedCat) => {
	// console.log("here", selectedCat);
	$.ajax({
		url: `/store`,
		type: "post",
		data: { keywords: keywords, sort: sort, selectedCat: selectedCat },
		success: function () {
			console.log("search fired");
		},
	})
		.done(function (data) {
			// console.log(data);
			// console.log("search complete");
			let item = data.item;
			if (item.length > 0) {
				$(".item").append(`<h3 class="mx-4">Items</h3>`);
				appendItem(data);
			} else {
				$(".store").append(`<h3 class="mx-4">No results found</h3>`);
			}
		})
		.fail(() => console.log("hahafail"))
		.always(() => console.log("running"));
};

const searchStore = (storeId, storeName) => {
	$.ajax({
		url: `/store`,
		type: "POST",
		data: {
			storeId: storeId,
		},
		success: function () {
			console.log("success search store");
		},
	})
		.done(function (data) {
			$(".store").append(`<h3 class="mx-4">${storeName}</h3>`);
			// console.log(data);
			appendItem(data);
		})
		.fail(() => console.log("hahafail outside"))
		.always(() => console.log("running outside"));
};

$(".add-to-cart").click((e) => {
	e.preventDefault();
	let item_id = e.target.dataset.item_id;
	let user_id = e.target.dataset.user_id;
	// console.log(item_id, "iid");
	// console.log(user_id, "uid");

	$.ajax({
		type: "POST",
		url: `/cart`,
		data: { item_id: item_id, user_id: user_id },
		success: function () {
			console.log("success");
		},
	})
		.done(function (data) {
			console.log(data);
		})
		.fail(function () {
			console.log("failed");
		})
		.always(() => console.log("running"));
});
