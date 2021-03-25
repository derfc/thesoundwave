$("#edit-display-name").on("keyup", function (e) {
	console.log("hello");
	$("#check-availability").empty();
	let newDisplayName = e.target.value;
	console.log(newDisplayName, "want to change to this change this");
	checkAvailability(newDisplayName);
	// $("#check-availability").empty().append(`<p>${newDisplayName}</p>`);
});

const checkAvailability = (newDisplayName) => {
	console.log("check checkAvailability here");
	$("#check-availability").empty().append(`<p>${newDisplayName}</p>`);
};
