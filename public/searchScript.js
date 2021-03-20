$("#filter_songs").keyup((e) => {
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
				if (artist.length == 0 && album.length == 0 && song.length == 0) {
					$(".artist").append(`<p>no result found<p>`);
				}
				for (let i = 0; i < artist.length; i++) {
					let artistName = artist[i].artist_name;
					$(".artist").append(`<p>returning ${artistName}<p>`);
				}
				for (let i = 0; i < album.length; i++) {
					let albumName = album[i].album_name;
					$(".album").append(`<p>returning ${albumName}<p>`);
				}
				for (let i = 0; i < song.length; i++) {
					let songName = song[i].song_name;
					$(".song").append(`<p>returning ${songName}<p>`);
				}
			})
			.fail(() => console.log("hahafail"))
			.always(() => console.log("running"));
	}
});
