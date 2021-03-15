$(document).ready(() => {
	if ($(".subtotal").length !== 0) {
		let total = 0;
		for (let i = 0; i < $(".subtotal").length; i++) {
			let subtotal = +$(".subtotal")[i].innerText.replace("$", "");
			total += subtotal;
		}
		$("#total")[0].innerText = `TOTAL = ${total}`;
	}

	$(".add-to-cart").click((e) => {
		e.preventDefault();
		console.log(e.target.dataset);
		let item_id = e.target.dataset.item_id;
		let user_id = e.target.dataset.user_id;
		console.log(item_id, user_id);

		$.ajax({
			type: "POST",
			url: `/cart`,
			data: { item_id: item_id, user_id: user_id },
			success: function () {
				console.log("success");
			},
		})
			.done(function () {
				window.location.reload();
			})
			.fail(function () {
				console.log("failed");
			});
	});

	$(".quantity").change((e) => {
		// e.preventDefault();
		let subtotal = e.target.dataset.subtotal;
		let quantity = e.target.value;
		let item_id = e.target.dataset.item_id;
		console.log(item_id);
		return new Promise((res, rej) => {
			res(($(`#subtotal${item_id}`)[0].innerText = `${subtotal * quantity}`));
		}).then(() => {
			if ($(".subtotal").length !== 0) {
				let total = 0;
				for (let i = 0; i < $(".subtotal").length; i++) {
					let subtotal = +$(".subtotal")[i].innerText.replace("$", "");
					total += subtotal;
				}
				$("#total")[0].innerText = `TOTAL = ${total}`;
			}
		});
	});

	$(".delete-item").click((e) => {
		e.preventDefault();
		console.log("hello", e.target);
		// $.ajax({
		// 	url: `/cart/${e.target.id}`,
		// 	type: "DELETE",
		// 	success: function () {
		// 		console.log("success del");
		// 	},
		// })
		// 	.done(function () {
		// 		window.location.reload();
		// 		// console.log("hello");
		// 	})
		// 	.fail(() => console.log("hahafail"))
		// 	.always(() => console.log("running"));
	});

	$("#checkout").click((e) => {
		e.preventDefault();
		alert("checkout");
	});
});
