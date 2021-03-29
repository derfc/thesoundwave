$("#button-default").click((e) => {
	e.preventDefault();
	$.ajax({
		type: "POST",
		url: `/setting`,
		data: { setToDefaultDisplayName: "dafault" },
		success: function () {
			console.log("success");
		},
	})
		.done(function (data) {
			// console.log(data);
			window.location.reload();
		})
		.fail(function () {
			console.log("failed");
		})
		.always(() => console.log("running"));
});

$("#edit-display-name").on("keyup", function (e) {
	e.preventDefault();
	$(".confirm").empty();
	$("#check-availability").empty();
	let desireDisplayName = e.target.value;
	// console.log(newDisplayName, "want to change to this change this");
	// console.log("check checkAvailability here");
	$.ajax({
		type: "POST",
		url: `/setting`,
		data: { desireDisplayName: desireDisplayName },
		success: function () {
			console.log("successssssss");
		},
	})
		.done(function (data) {
			console.log(data, "back to front end");
			if (data == "used") {
				$("#check-availability")
					.empty()
					.append(
						"<h3 class='pt-2' style='color:rgb(236, 236, 236);'>STATUS: Display name used</h3>"
					);
			} else {
				$("#check-availability")
					.empty()
					.append(
						"<h3 class='pt-2' style='color:rgb(236, 236, 236);'>STATUS: Display name available</h3>"
					);
				$(".confirm")
					.empty()
					.append(
						`<button class="btn my-2 button-confirm" id="button-confirm" value="confirm">Confirm changes</button>`
					);

				$("#button-confirm").click((e) => {
					e.preventDefault();
					let newDisplayName = $("#edit-display-name")[0].value;
					console.log("confirm", newDisplayName);
					$.ajax({
						type: "PUT",
						url: `/setting`,
						data: { newDisplayName: newDisplayName },
						success: function () {
							console.log("success");
						},
					})
						.done(function (data) {
							console.log(data);
							window.location.reload();
						})
						.fail(function () {
							console.log("failed");
						})
						.always(() => console.log("running"));
				});
			}
		})
		.fail(function () {
			console.log("failed");
		})
		.always(() => console.log("runnnnnnning"));
});

// const updateDisplayName = (status) => {};
$("#button-edit").click((e) => {
	e.preventDefault();
	console.log(e.target);
	if ($("#display-name")[0].style.display == "block") {
		$("#display-name")[0].style.display = "none";
		e.target.innerText = "Cancel changes";
	} else {
		$("#display-name")[0].style.display = "block";
		e.target.innerText = "Edit display name";
		$(".confirm").empty();
		$("#check-availability").empty();
	}

	if ($("#edit-display-name")[0].style.display == "block") {
		$("#edit-display-name")[0].style.display = "none";
	} else {
		$("#edit-display-name")[0].style.display = "block";
	}
});

$("#button-show-history").click((e) => {
	console.log("hello");
	if (e.target.innerText == "Close") {
		e.target.innerText = "Show purchase history";
		$(".purchase-history").empty();
	} else {
		e.target.innerText = "Close";
		$.ajax({
			type: "POST",
			url: `/setting`,
			data: { showHistory: "showHistory" },
			success: function () {
				console.log("success");
			},
		})
			.done(function (data) {
				console.log(data);
				if (data.length == 0) {
					$(".purchase-history").empty().append(`<p>No history found</p>`);
				}
				$(".purchase-history").empty();
				for (let i = data.length - 1; i > -1; i--) {
					$(".purchase-history").append(
						`<h6>Order id: ${data[i].id}</h6><button class="btn button-show-order" id="button-show-order" data-transection_id="${data[i].id}">Show order history</button><div class="order-history" id="order-history${data[i].id}"></div><hr>`
					);
				}

				$(".button-show-order").click((e) => {
					let transectionId = e.target.dataset.transection_id;
					console.log(transectionId);
					if (e.target.innerText == "Close") {
						e.target.innerText = "Show order history";
						$(`#order-history${transectionId}`).empty();
					} else {
						e.target.innerText = "Close";
						$.ajax({
							type: "POST",
							url: `/setting`,
							data: { transectionId: transectionId },
							success: function () {
								console.log("success");
							},
						})
							.done(function (data) {
								console.log(data);
								$(
									`#order-history${transectionId}`
								).append(`<div class="row pt-2">
								<div class="col">
								<h6>Product Name</h6>
								</div>	
								<div class="col">
								<h6>Price</h6>
								</div>
								<div class="col">
								<h6>Quantity</h6>
								</div>
								</div>
								<hr class="mt-1 mb-2">`);
								for (let i = 0; i < data.length; i++) {
									$(`#order-history${data[i].transection_id}`).append(
										`
										<div class="row">
										<div class="col">
										<h6> ${data[i].item_name} </h6>
										</div>
										<div class="col">
										<h6> $${data[i].item_price / 100}</h6>
										</div>
										<div class="col">
										<h6> ${data[i].quantity} </h6>
										</div>
										`
									);
								}
							})
							.fail(function () {
								console.log("failed");
							})
							.always(() => console.log("running"));
					}
				});
			})
			.fail(function () {
				console.log("failed");
			})
			.always(() => console.log("running"));
	}
});
