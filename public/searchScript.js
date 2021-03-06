var today = new Date();
var curHr = today.getHours();

if (curHr < 12) {
	$(".greetings")[0].innerHTML =
		'<h3 class="mx-4 my-3 fw-bolder">Good Morning</h3>';
} else if (curHr < 18) {
	$(".greetings")[0].innerHTML =
		'<h3 class="mx-4 my-3 fw-bolder">Good Afternoon</h3>';
} else {
	$(".greetings")[0].innerHTML =
		'<h3 class="mx-4 my-3 fw-bolder">Good Evening</h3>';
}

$("#filter_songs").on("keyup search", function (e) {
	// console.log("hello", e.target.value);
	let keywords = e.target.value;
	$(".title").empty();
	$(".album").empty();
	$(".song").empty();
	$(".artist").empty();
	if (!keywords) {
		$(".noneWhenSearch")[0].style.display = "block";
		$(".noneWhenSearch")[1].style.display = "block";
	} else {
		$(".noneWhenSearch")[0].style.display = "none";
		$(".noneWhenSearch")[1].style.display = "none";
		$.ajax({
			url: `/home`,
			type: "post",
			data: { keywords: keywords },
			success: function () {
				// console.log("search fired");
			},
		})
			.done(function (data) {
				// console.log("search complete");
				let artist = data.artist;
				let album = data.album;
				let song = data.song;
				// let playlist = data.playlist;
				if (artist.length == 0 && album.length == 0 && song.length == 0) {
					$(".artist").empty();
					$(".album").empty();
					$(".song").empty();
					$(".title").empty();
					$(".title").append(`<p class="mx-4">No results found</p>`);
				}
				if (artist.length > 0) {
					$(".artist").empty();
					$(".artist").append(
						`<h3 class="mx-4" style="text-decoration: underline">Artist</h3>`
					);
					appendArtist(data);
				}
				if (album.length > 0) {
					$(".album").empty();
					$(".album").append(
						`<h3 class="mx-4" style="text-decoration: underline">Album</h3>`
					);
					appendAlbum(data);
				}
				if (song.length > 0) {
					$(".song").empty();
					$(".song").append(
						`<h3 class="mx-4 songsong" style="text-decoration: underline">Song</h3>`
					);
					appendSong(data);
				}
			})
			.fail(() => console.log("hahafail"))
			.always(() => console.log("running"));
	}
});

$(".clear-search").click((e) => {
	e.preventDefault();
	$(".artist").empty();
	$(".album").empty();
	$(".song").empty();
	$(".title").empty();
	$(".noneWhenSearch")[0].style.display = "block";
	$(".noneWhenSearch")[1].style.display = "block";
});

$(".search-artist").click((e) => {
	// console.log("should show", e.target.value);
	$(".noneWhenSearch")[0].style.display = "none";
	$(".noneWhenSearch")[1].style.display = "none";
	$(".artist").empty();
	$(".album").empty();
	$(".song").empty();
	$(".title").empty();
	// clearAll();
	$(".title").empty();
	$.ajax({
		url: `/home`,
		type: "POST",
		data: { keywords: e.target.value },
		success: function () {
			// console.log("success search artist");
		},
	})
		.done(function (data) {
			// console.log(data.artist);
			// let artist = data.artist;
			// $(".artist").append(`<p>Artist</p>`);
			appendArtist(data);
		})
		.fail(() => console.log("hahafail inside"))
		.always(() => console.log("running inside"));
});

$(".search-album").click((e) => {
	// console.log(e.target.value);
	$(".noneWhenSearch")[0].style.display = "none";
	$(".noneWhenSearch")[1].style.display = "none";
	$(".artist").empty();
	$(".album").empty();
	$(".song").empty();
	$(".title").empty();
	// clearAll();
	$(".title").empty();
	$.ajax({
		url: `/home`,
		type: "POST",
		data: { keywords: e.target.value },
		success: function () {
			console.log("success search artist");
		},
	})
		.done(function (data) {
			// console.log(data.album);
			appendAlbum(data);
		})
		.fail(() => console.log("hahafail inside"))
		.always(() => console.log("running inside"));
});

const appendSong = (result) => {
	// if (result.album[0]) {
	// 	let albumName = result.album[0].album_name;
	// 	let albumPhoto = result.album[0].album_photo;
	// 	$(".album").append(
	// 		`<div class="mx-4 my-3"><img class="image img-fluid" src="${albumPhoto}" alt="${albumName} Photo"/></div>`
	// 	);
	// }

	for (let i = 0; i < result.song.length; i++) {
		let songId = result.song[i].id;
		// console.log(songId, "what are u");
		let songName = result.song[i].song_name;
		let songUrl = result.song[i].song_url;
		// console.log(result.song[0]);
		$(".song").append(
			`
			<div class="mx-3">	
			<button class="btn play-thisthis playSong" data-song_id="${songId}" data-song_url="${songUrl}"><i class="fal fa-play-circle"></i></button>
			<button class="btn select-playlist" data-song_id="${songId}"><i class="fal fa-plus"></i></button>
			<h6 class="d-inline songName">${songName}</h6>
			<ul class="list" id="list${songId}"></ul>
			</div>`
		);
		for (let y = 0; y < result.playlist.length; y++) {
			let playlistName = result.playlist[y].playlist_name;
			let libraryId = result.playlist[y].id;
			$(`#list${songId}`).append(
				`<li><button class="btn add-to-playlist p-0" data-song_id="${songId}" data-library_id="${libraryId}">Add to ${playlistName}</button></li>`
			);
		}
	}
	// playsong from appended list
	$(".play-thisthis").click((e) => {
		index = songList.findIndex((p) => p.song_url == e.target.dataset.song_url);
		load_playlist();
		playsong();
	});

	$(".select-playlist").click((e) => {
		// e.preventDefault();
		// console.log("target", e.target);
		let song_id = e.target.dataset.song_id;
		// console.log(song_id, "song id");
		// console.log("working on this", $(`#list${song_id}`));

		if ($(`#list${song_id}`)[0].style.display == "block") {
			$(`#list${song_id}`)[0].style.display = "none";
		} else {
			$(`#list${song_id}`)[0].style.display = "block";
		}
	});

	$(".add-to-playlist").click((e) => {
		e.preventDefault();
		let song_id = e.target.dataset.song_id;
		let library_id = e.target.dataset.library_id;
		// console.log(" songid", song_id);
		// console.log(" plid ", library_id);
		$.ajax({
			url: `/playlist/${library_id}/${song_id}`,
			type: "post",
			success: function () {
				console.log("add fired");
			},
		})
			.done(function (result) {
				console.log(result);
				$(`#list${song_id}`)[0].style.display = "none";
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

	//$go to alb
	$(".go-to-album").click((e) => {
		let albumId = e.target.dataset.album_id;
		$.ajax({
			url: `/home/album/${albumId}`,
			type: "post",
			success: function () {
				console.log("add fired");
			},
		})
			.done(function (result) {
				// console.log(result);
				let album = result.album[0];
				$(".title").empty();
				$(".artist").empty();
				$(".album").empty();
				$(".song").empty();
				$(".title").append(
					`<h3 class="mx-4 songsong">${album.album_name}</h3>`
				);
				let albumName = result.album[0].album_name;
				let albumPhoto = result.album[0].album_photo;
				$(".album").append(
					`<div class="mx-4 my-3"><img style="max-height:200px; max-width:200px" class="image img-fluid" src="${albumPhoto}" alt="${albumName} Photo"/></div>`
				);
				appendSong(result);
			})
			.fail(() => console.log("fail add"))
			.always(() => console.log("runrunrun"));
	});
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
				<div class="album-img">
				<img class="image img-fluid" src="${artistPhoto}" alt="${artistNameEng} ${artistNameChi} Photo"/>
				</div>
				<button class="btn go-to-artist" my-2 data-artist_id ="${artistId}">${artistNameEng} ${artistNameChi}</button></br>
				</div>
				`
			);
		} else {
			$(".appendArtist").append(
				`
				<div class="col-lg-2 col-md-3 col-sm-4 my-3">
				<div class="album-img">
				<img class="image img-fluid" src="${artistPhoto}" alt="${artistNameEng} Photo"/>
				</div>
				<button class="btn go-to-artist" my-2 data-artist_id ="${artistId}">${artistNameEng}</button></br>
				</div>
				`
			);
		}
	}
	$(".go-to-artist").click((e) => {
		// console.log(e.target);
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
				$(".title").empty();
				$(".artist").empty();
				$(".album").empty();
				$(".song").empty();
				let artist = result.artist[0];
				// let album = result.album;
				if (artist.artist_name_chi) {
					$(".title").append(
						`<h1 class="mx-4"><b>${artist.artist_name_eng} &nbsp;${artist.artist_name_chi}</b></h1>`
					);
				} else {
					$(".title").append(
						`<h1 class="mx-4"><b>${artist.artist_name_eng}</b></h1>`
					);
				}
				appendAlbum(result);
			})
			.fail(() => console.log("fail add"))
			.always(() => console.log("runrunrun"));
	});
	//$go to art
};

$(".go-to-artist").click((e) => {
	// console.log(e.target);
	$(".noneWhenSearch")[0].style.display = "none";
	$(".noneWhenSearch")[1].style.display = "none";
	$(".title").empty();
	$(".artist").empty();
	$(".album").empty();
	$(".song").empty();
	// clearAll();
	let artistId = e.target.dataset.artist_id;
	$.ajax({
		url: `/home/artist/${artistId}`,
		type: "post",
		success: function () {
			// console.log("go-to-artist");
		},
	})
		.done(function (result) {
			// console.log(result);
			let artist = result.artist[0];
			// let album = result.album;
			if (artist.artist_name_chi) {
				$(".title").append(
					`<h1 class="mx-4"><b>${artist.artist_name_eng} &nbsp;${artist.artist_name_chi}</b></h1>`
				);
			} else {
				$(".title").append(
					`<h1 class="mx-4"><b>${artist.artist_name_eng}</b></h1>`
				);
			}
			appendAlbum(result);
		})
		.fail(() => console.log("fail add"))
		.always(() => console.log("runrunrun"));
});

$(".go-to-album").click((e) => {
	$(".noneWhenSearch")[0].style.display = "none";
	$(".noneWhenSearch")[1].style.display = "none";
	$(".title").empty();
	$(".artist").empty();
	$(".album").empty();
	$(".song").empty();
	// clearAll();
	let albumId = e.target.dataset.album_id;
	$.ajax({
		url: `/home/album/${albumId}`,
		type: "post",
		success: function () {
			console.log("add fired");
		},
	})
		.done(function (result) {
			// console.log(result);
			let playlist = result.playlist;
			let album = result.album[0];
			$(".title").append(`<h3 class="mx-4 songsong">${album.album_name}</h3>`);
			appendSong(result);
		})
		.fail(() => console.log("fail add"))
		.always(() => console.log("runrunrun"));
});
