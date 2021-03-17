$(document).ready(() => {
	let total = 0;
	if ($(".subtotal").length !== 0) {
		for (let i = 0; i < $(".subtotal").length; i++) {
			let subtotal = +$(".subtotal")[i].innerText.replace("$", "");
			total += subtotal;
		}
		$("#total")[0].innerText = `TOTAL = $${total.toFixed(2)}`;
	} else {
		$("#total")[0].innerText = `TOTAL = $${total.toFixed(2)}`;
	}

	// $(".add-to-cart").click((e) => {
	// 	e.preventDefault();
	// 	let item_id = e.target.dataset.item_id;
	// 	let user_id = e.target.dataset.user_id;

	// 	$.ajax({
	// 		type: "POST",
	// 		url: `/cart`,
	// 		data: { item_id: item_id, user_id: user_id },
	// 		success: function () {
	// 			console.log("success");
	// 		},
	// 	})
	// 		.done(function () {
	// 			window.location.reload();
	// 		})
	// 		.fail(function () {
	// 			console.log("failed");
	// 		});
	// });

	$(".quantity").change((e) => {
		let unitPrice = e.target.dataset.subtotal;
		let quantity = e.target.value;
		let item_id = e.target.dataset.item_id;
		return new Promise((res, rej) => {
			let subtotal = (unitPrice * quantity).toFixed(2);
			res(($(`#subtotal${item_id}`)[0].innerText = `${subtotal}`));
		}).then(() => {
			if ($(".subtotal").length !== 0) {
				let total = 0;
				for (let i = 0; i < $(".subtotal").length; i++) {
					let subtotal = +$(".subtotal")[i].innerText.replace("$", "");
					total += subtotal;
				}
				$("#total")[0].innerText = `TOTAL = $${total.toFixed(2)}`;
			}
		});
	});

	$(".delete-item").click((e) => {
		e.preventDefault();
		$.ajax({
			url: `/cart/${e.target.dataset.user_id}/${e.target.dataset.item_id}`,
			type: "DELETE",
			success: function () {
				console.log("success del");
			},
		})
			.done(function () {
				window.location.reload();
			})
			.fail(() => console.log("hahafail"))
			.always(() => console.log("running"));
	});
	var stripeHandler = StripeCheckout.configure({
		key: stripePK,
		locale: "auto",
		token: function (token) {
			var items = [];
			for (let i = 0; i < $(".quantity").length; i++) {
				let quantity = $(".quantity")[i].value;
				if (quantity == "") {
					quantity = 1;
				}
				let item_id = $(".quantity")[i].dataset.item_id;
				items.push({ item_id: item_id, quantity: quantity });
			}

			$.ajax({
				url: `/purchase`,
				type: "POST",
				data: {
					stripeTokenId: token.id,
					email: token.email,
					items: items,
				},
				success: function (data) {
					console.log("Success", data);
				},
				error: function (err) {
					console.log("Ajax Error!");
					console.log(err);
				},
			});
		},
	});
	$("#checkout").click((e) => {
		var price = $("#total")[0].innerText.replace("TOTAL = $", "");
		stripeHandler.open({
			amount: price * 100,
		});
	});
});
