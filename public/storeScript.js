$("#filter_store").on("keyup search", function (e) {
	console.log("hello", e.target.value);
	clearAll();
	let keywords = e.target.value;
	if (!keywords) {
		$(".featuring").append("<p>featuring stuff</p>");
	} else {
		$.ajax({
			url: `/store`,
			type: "post",
			data: { keywords: keywords },
			success: function () {
				console.log("search fired");
			},
		})
			.done(function (data) {
				console.log(data);
				console.log("search complete");
				let store = data.store;
				let items = data.items;
				if (store.length == 0 && items.length == 0) {
					$(".store").append(`<p>no result found</p>`);
				}
				if (store.length > 0) {
					$(".store").append(`<h3>store</h3>`);
					appendStore(data);
				}
				if (items.length > 0) {
					$(".item").append(`<h3>item</h3>`);
					appendItem(data);
				}

				// $(".add-to-playlist").click((e) => {
				// 	addToPlaylist(e);
				// });
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
			$(".artist").append(`<p>Artist</p>`);
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
							$(".album").append(
								`<h3>${artist.artist_name_eng} ${artist.artist_name_chi}</h3>`
							);
						} else {
							$(".album").append(`<h3>${artist.artist_name_eng}</h3>`);
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
			$(".album").append(`<p>Album</p>`);
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
		.fail(() => console.log("hahafail inside"))
		.always(() => console.log("running inside"));
});

const clearAll = () => {
	$(".store").empty();
	$(".item").empty();
};

const appendSong = (result) => {
	for (let i = 0; i < result.song.length; i++) {
		let songId = result.song[i].id;
		let songName = result.song[i].song_name;
		let songUrl = result.song[i].song_url;
		// console.log(result.song[0]);
		$(".song").append(
			`<p>returning ${songName}</p><button class="playSong" data-song_id="${songId}" data-song_url="${songUrl}">play ${songName}</button><button class="select-playlist" data-song_id="${songId}">add to playlist</button><ul class="list" id="list${i}"></ul></br>`
		);
		for (let y = 0; y < result.playlist.length; y++) {
			let playlistName = result.playlist[y].playlist_name;
			let libraryId = result.playlist[y].id;
			$(`#list${i}`).append(
				`<li><button class="add-to-playlist" data-song_id="${songId}" data-library_id="${libraryId}">add to here ${playlistName}</button></li>`
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
	for (let i = 0; i < result.album.length; i++) {
		let albumName = result.album[i].album_name;
		let albumPhoto = result.album[i].album_photo;
		let albumId = result.album[i].id;
		$(".album").append(
			`<img src="${albumPhoto}" alt="${albumName} Photo"/></br>
			<button class="go-to-album" data-album_id ="${albumId}">${albumName}</button></br>`
		);
	}
};

const appendArtist = (result) => {
	// console.log(result);
	$(".artist").append('<div class="song d-flex helloArtist flex-wrap"></div>');
	for (let i = 0; i < result.artist.length; i++) {
		let artistNameEng = result.artist[i].artist_name_eng;
		let artistNameChi = result.artist[i].artist_name_chi;
		let artistPhoto = result.artist[i].artist_photo;
		let artistId = result.artist[i].id;
		if (artistNameChi) {
			$(".helloArtist").append(
				`
				<div class="album-card m-4">
				<img src="${artistPhoto}" alt="${artistNameEng} ${artistNameChi} Photo"/></br>
				<button class="btn btn-info go-to-artist" data-artist_id ="${artistId}">${artistNameEng} ${artistNameChi}</button></br>
				</div>
				`
			);
		} else {
			$(".helloArtist").append(
				`
				<div class="album-card m-4">
				<img src="${artistPhoto}" alt="${artistNameEng} Photo"/></br>
				<button class="btn btn-info go-to-artist" data-artist_id ="${artistId}">${artistNameEng}</button></br>
				</div>
				`
			);
		}
	}
};

const appendStore = (result) => {
	// console.log(result);
	for (let i = 0; i < result.store.length; i++) {
		let storeName = result.store[i].store_name;
		let storePhoto = result.store[i].store_photo;
		let storeId = result.store[i].id;
		$(".store").append(
			// <img src="${albumPhoto}" alt="${albumName} Photo"/></br>
			`<button class="go-to-store" data-store_id ="${storeId}">${storeName}</button></br>`
		);
	}
};

const appendItem = (result) => {
	// console.log(result);
	for (let i = 0; i < result.items.length; i++) {
		let itemName = result.items[i].item_name;
		let itemPhoto = result.items[i].item_photo;
		let itemPrice = result.items[i].item_price;
		let itemId = result.items[i].id;
		$(".item").append(
			`<img src=${itemPhoto} alt="${itemName} Photo"/></br>
			<p>$${itemPrice / 100}</p>
			<button class="" data-item_id ="${itemId}">${itemName}</button></br>`
		);
	}
};
