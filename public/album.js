$(document).ready(() => {
	console.log($(".album-info")[0]);
	let albumSongIdArr = albumSongId.split("[split]");
	let albumNameArr = albumName.split("[split]");
	let albumNaneIdArr = albumId.split("[split]");
	for (let i = 0; i < albumSongIdArr.length - 1; i++) {
		let songId = albumSongIdArr[i];
		$(`#list${i}`).empty();
		for (let y = 0; y < albumNameArr.length - 1; y++) {
			let playlistName = albumNameArr[y];
			let libraryId = albumNaneIdArr[y];
			$(`#list${i}`).append(
				`<li><button class="add-to-playlist" data-song_id="${songId}" data-library_id="${libraryId}">add to here ${playlistName}</button></li>`
			);
		}
	}
	$(".select-playlist").click((e) => {
		// e.preventDefault();
		console.log("hello", e.target);
		// if ($(".list")[0].style.display == "block") {
		// 	$(".list")[0].style.display = "none";
		// } else {
		// 	$(".list")[0].style.display = "block";
		// }
	});

	$(".add-to-playlist").click((e) => {
		e.preventDefault();
		let song_id = e.target.dataset.song_id;
		let library_id = e.target.dataset.library_id;
		console.log(" songid", song_id);
		console.log(" plid ", library_id);
		$.ajax({
			url: `/playlist/${library_id}/${song_id}`,
			type: "post",
			success: function () {
				console.log("add fired");
			},
		})
			.done(function (result) {
				console.log(result);
			})
			.fail(() => console.log("fail add"))
			.always(() => console.log("runrunrun"));
	});
});
