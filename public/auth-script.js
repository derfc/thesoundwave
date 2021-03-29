$(document).ready(() => {
	$("#facebook").click((e) => {
		location.href = "/auth/facebook";
	});

	$("#google").click((e) => {
		location.href = "/auth/google";
	});

	$("#registerbutton").click((e) => {
		e.preventDefault();

		let username = $("#username").val();
		let password = $("#password").val();
		let confirmPassword = $("#confirmPassword").val();
		// console.log(username, password, confirmPassword)

		if (username !== "" && password !== "" && confirmPassword !== "") {
			if (confirmPassword !== password) {
				$(".wrongPW")
					.empty()
					.append(
						"<h4 class='text-warning'>Your password does not match !</h4>"
					);
				$("#username").val("");
				$("#password").val("");
				$("#confirmPassword").val("");
			} else {
				$.ajax({
					type: "POST",
					url: `/auth/register`,
					data: { username: username, password: confirmPassword },
					success: function () {
						console.log("success");
					},
				})
					.done(function (response) {
						// console.log(response);
						// $.get('/auth/login')
						window.location.href = "/auth/login";

						console.log("done");
					})
					.fail(function () {
						console.log("failed");
					});
			}
		} else {
			$(".wrongPW")
				.empty()
				.append("<h4 class='text-warning'>Fields must not be empty !</h4>");
			$("#username").val("");
			$("#password").val("");
			$("#confirmPassword").val("");
		}
	});

	$("#cancelButton").click((e) => {
		// $('#loginUsername').val('')
		// $('#loginPassword').val('')
		window.location.href = "/";
	});
});
