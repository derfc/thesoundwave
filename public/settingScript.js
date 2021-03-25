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
				$("#check-availability").empty().append("used");
			} else {
				$("#check-availability").empty().append("availabile");
				$(".confirm")
					.empty()
					.append(
						`<button class="button-confirm" id="button-confirm" value="confirm">confirm</button>`
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
		e.target.innerText = "cancel";
	} else {
		$("#display-name")[0].style.display = "block";
		e.target.innerText = "edit";
		$(".confirm").empty();
		$("#check-availability").empty();
	}

	if ($("#edit-display-name")[0].style.display == "block") {
		$("#edit-display-name")[0].style.display = "none";
	} else {
		$("#edit-display-name")[0].style.display = "block";
	}
});
