$("#filter_songs").on("keyup search", function (e) {
	console.log("hello", e.target.value);
	$(".featuring").empty();
	$(".artist").empty();
	$(".album").empty();
	$(".song").empty();
	let keywords = e.target.value;
	if (!keywords) {
		$(".featuring").append("<p>featuring stuff</p>");
	} else {
		$.ajax({
			url: `/home`,
			type: "post",
			data: { keywords: keywords },
			success: function () {
				console.log("search fired");
			},
		})
			.done(function (data) {
				console.log("search complete");
				let artist = data.artist;
				let album = data.album;
				let song = data.song;
				let playlist = data.playlist;
				if (artist.length == 0 && album.length == 0 && song.length == 0) {
					$(".artist").append(`<p>no result found</p>`);
				}
				if (artist.length > 0) {
					$(".artist").append(`<a href="/artist"><h3>Artist</h3></a>`);
					for (let i = 0; i < artist.length; i++) {
						let artistName = artist[i].artist_name;
						let artistPhoto = artist[i].artist_photo;
						let artistId = artist[i].id;
						$(".artist").append(
							`<img src="${artistPhoto}" alt="${artistName} Photo"/></br><a href="/artist/${artistId}">${artistName}</a></br>`
						);
					}
				}
				if (album.length > 0) {
					$(".album").append(`<a href="/album"><h3>album</h3></a>`);
					for (let i = 0; i < album.length; i++) {
						let albumName = album[i].album_name;
						let albumPhoto = album[i].album_photo;
						let albumId = album[i].id;
						$(".album").append(
							`<img src="${albumPhoto}" alt="${albumName} Photo"/></br><a href="/album/${albumId}">${albumName}</a></br>`
						);
					}
				}
				if (song.length > 0) {
					$(".song").append(`<h3>Song</h3>`);
					for (let i = 0; i < song.length; i++) {
						let songName = song[i].song_name;
						let songId = song[i].id;
						console.log(song[0]);
						$(".song").append(
							`<p>returning ${songName}</p><button class="select-playlist" data-song_id="${songId}">add to playlist</button><ul class="list" id="list${i}"></ul>`
						);
						for (let y = 0; y < playlist.length; y++) {
							let playlistName = playlist[y].playlist_name;
							let libraryId = playlist[y].id;
							$(`#list${i}`).append(
								`<li><button class="add-to-playlist" data-song_id="${songId}" data-library_id="${libraryId}">add to here ${playlistName}</button></li>`
							);
						}
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
			})
			.fail(() => console.log("hahafail"))
			.always(() => console.log("running"));
	}
});
