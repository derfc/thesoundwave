$("#filter_songs").on("keyup search", function (e) {
	// console.log("hello", e.target.value);
	clearAll();
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
					$(".artist").append(`<p class="mx-4">No results found</p>`);
				}
				if (artist.length > 0) {
					$(".artist").append(`<h3 class="mx-4" style="text-decoration: underline">Artist</h3>`);
					appendArtist(data);
				}
				if (album.length > 0) {
					$(".album").append(`<h3 class="mx-4" style="text-decoration: underline">Album</h3>`);
					appendAlbum(data);
				}
				if (song.length > 0) {
					$(".song").append(`<h3 class="mx-4 songsong" style="text-decoration: underline">Song</h3></br>`);
					appendSong(data);
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
					addToPlaylist(e);
				});
			})
			.fail(() => console.log("hahafail"))
			.always(() => console.log("running"));
	}
});

$(".search-artist").click((e) => {
	// console.log(e.target.value);
	clearAll();
	$.ajax({
		url: `/home`,
		type: "POST",
		data: { keywords: e.target.value },
		success: function () {
			console.log("success search artist");
		},
	})
		.done(function (data) {
			console.log(data.artist);
			// let artist = data.artist;
			// $(".artist").append(`<p>Artist</p>`);
			appendArtist(data);

			$(".go-to-artist").click((e) => {
				// console.log(e.target);
				clearAll();
				let artistId = e.target.dataset.artist_id;
				$.ajax({
					url: `/home/artist/${artistId}`,
					type: "post",
					success: function () {
						console.log("go-to-artist");
					},
				})
					.done(function (result) {
						// console.log(result);
						let artist = result.artist[0];
						// let album = result.album;
						if (artist.artist_name_chi) {
							$(".artist").append(
								`<h1 class="mx-4"><b>${artist.artist_name_eng} &nbsp;${artist.artist_name_chi}</b></h1>`
							);
						} else {
							$(".artist").append(`<h1 class="mx-4"><b>${artist.artist_name_eng}</b></h1>`);
						}
						appendAlbum(result);

						$(".go-to-album").click((e) => {
							clearAll();
							let albumId = e.target.dataset.album_id;
							$.ajax({
								url: `/home/album/${albumId}`,
								type: "post",
								success: function () {
									console.log("add fired");
								},
							})
								.done(function (result) {
									console.log(result);
									let playlist = result.playlist;
									let album = result.album[0];
									$(".song").append(`<h3>${album.album_name}</h3></br>`);
									appendSong(result);
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
										addToPlaylist(e);
									});
								})
								.fail(() => console.log("fail add"))
								.always(() => console.log("runrunrun"));
						});
					})
					.fail(() => console.log("fail add"))
					.always(() => console.log("runrunrun"));
			});
		})
		.fail(() => console.log("hahafail inside"))
		.always(() => console.log("running inside"));
});

$(".search-album").click((e) => {
	// console.log(e.target.value);
	clearAll();
	$.ajax({
		url: `/home`,
		type: "POST",
		data: { keywords: e.target.value },
		success: function () {
			console.log("success search artist");
		},
	})
		.done(function (data) {
			console.log(data.album);
			let album = data.album;
			// $(".album").append(`<p>Album</p>`);
			// $(".album").append(
			// 	`<button  class="button-album search-album" value="album">album</button>`
			// );
			appendAlbum(data);

			$(".go-to-album").click((e) => {
				// console.log(e.target);
				clearAll();
				let albumId = e.target.dataset.album_id;
				$.ajax({
					url: `/home/album/${albumId}`,
					type: "post",
					success: function () {
						console.log("add fired");
					},
				})
					.done(function (result) {
						console.log(result);
						let playlist = result.playlist;
						let album = result.album[0];
						$(".song").append(`<h3 class="songsong mx-4">${album.album_name}</h3></br>`);
						appendSong(result);
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
							addToPlaylist(e);
						});
					})
					.fail(() => console.log("fail add"))
					.always(() => console.log("runrunrun"));
			});
		})
		.fail(() => console.log("hahafail inside"))
		.always(() => console.log("running inside"));
});

const clearAll = () => {
	$(".featuring").empty();
	$(".artist").empty();
	$(".album").empty();
	$(".song").empty();
	$(".carousel").empty();
};

const appendSong = (result) => {
	for (let i = 0; i < result.song.length; i++) {
		let songId = result.song[i].id;
		let songName = result.song[i].song_name;
		let songUrl = result.song[i].song_url;
		// console.log(result.song[0]);
		$(".song").append(
			`<span class="mx-4 songName">${songName}</span>
			<button class="btn btn-warning playSong" data-song_id="${songId}" data-song_url="${songUrl}"><i class="fal fa-play-circle"></i></button>
			<button class="btn select-playlist" data-song_id="${songId}">add to playlist</button>
			<ul class="list" id="list${i}"></ul></br>`
		);
		for (let y = 0; y < result.playlist.length; y++) {
			let playlistName = result.playlist[y].playlist_name;
			let libraryId = result.playlist[y].id;
			$(`#list${i}`).append(
				`<li><button class="btn btn-success add-to-playlist" data-song_id="${songId}" data-library_id="${libraryId}">add to here ${playlistName}</button></li>`
			);
		}
	}

	$(".select-playlist").click((e) => {
		// e.preventDefault();
		// console.log("hello", e.target);
		if ($(".list")[0].style.display == "block") {
			$(".list")[0].style.display = "none";
		} else {
			$(".list")[0].style.display = "block";
		}
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
};

const appendAlbum = (result) => {
	// console.log(result);
	$(".album").append('<div class="random-album appendAlbum px-4 row"></div>');
	for (let i = 0; i < result.album.length; i++) {
		let albumName = result.album[i].album_name;
		let albumPhoto = result.album[i].album_photo;
		let albumId = result.album[i].id;
		$(".appendAlbum").append(
			`
			<div class="col-lg-2 col-md-3 col-sm-4 my-3">
			<div class="album-img">
			<img class="image img-fluid" src="${albumPhoto}" alt="${albumName} Photo"/>
			</div>
			<button class="btn go-to-album my-2" data-album_id ="${albumId}">${albumName}</button></br>
			</div>
			`
		);
	}
};

const appendArtist = (result) => {
	// console.log(result);
	$(".artist").append('<div class="random-album appendArtist px-4 row"></div>');
	for (let i = 0; i < result.artist.length; i++) {
		let artistNameEng = result.artist[i].artist_name_eng;
		let artistNameChi = result.artist[i].artist_name_chi;
		let artistPhoto = result.artist[i].artist_photo;
		let artistId = result.artist[i].id;
		if (artistNameChi) {
			$(".appendArtist").append(
				`
				<div class="col-lg-2 col-md-3 col-sm-4 my-3">
				<img class="image img-fluid" src="${artistPhoto}" alt="${artistNameEng} ${artistNameChi} Photo"/></br>
				<button class="btn go-to-artist" my-2 data-artist_id ="${artistId}">${artistNameEng} ${artistNameChi}</button></br>
				</div>
				`
			);
		} else {
			$(".appendArtist").append(
				`
				<div class="col-lg-2 col-md-3 col-sm-4 my-3">
				<img class="image img-fluid" src="${artistPhoto}" alt="${artistNameEng} Photo"/></br>
				<button class="btn go-to-artist" my-2 data-artist_id ="${artistId}">${artistNameEng}</button></br>
				</div>
				`
			);
		}
	}
};
