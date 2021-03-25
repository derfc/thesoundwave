let previous = $("#previous");
let play = $("#play");
let next = $("#next");
// let title = $('#title');

let volume = $("#volume");
let displayVolume = $("#volume_show");
let slider = $("#duration_slider");
let track = $("#myTrack");
let current_time = $("#current_time");

// let track_image = $('#track_image');
// let present = $('#present');
// let total = $('#total');
// let artist = $('#artist');

let Playing_song = false;
let index = 0;
let random = 0;
let loop = 0;
let ismute = 0;
let vol = 80;
let space = 0;

let songList = [];
let songNameArr = songName.split("/");
let songUrlArr = songUrl.split("[split]");
let artistNameArr = artistName.split("/");

for (let i = 0; i < songNameArr.length - 1; i++) {
	songList.push({
		song_name: songNameArr[i],
		song_url: songUrlArr[i],
		artist_name: artistNameArr[i],
	});
}
let playlist = JSON.parse(JSON.stringify(songList));

// let source = track[0].src
// for (let i = 0; i < songList.length; i++) {
//     source = songList[i].song_url
//     song_length(source)
// }

// function song_length(src) {
//     let audio = new Audio();
//     $(audio).on("loadedmetadata", function () {
//         console.log(audio.duration);
//         console.log($('#song_length'))
//         $('#song_length')
//     });
//     audio.src = src;
// }

// song_length()

// {/* <p>${audio.duration}</p> */ }

// play-this-song
$('.play-this-song').click((e) => {
	index = songList.findIndex(p => p.song_name == e.target.innerHTML)
	load_playlist();
	playsong();
})

$('.play-another-this').click((e) => {
	console.log(e.target.dataset.song_name)
	index = songList.findIndex(p => p.song_name == e.target.dataset.song_name)
	load_playlist();
	playsong();

})

function repeat_song() {
	loop++;
	if (loop % 2) {
		$("#repeating").removeClass().addClass("fas fa-repeat-1-alt");
		track[0].loop = true;
	} else {
		$("#repeating").removeClass().addClass("fas fa-repeat-alt");
		track[0].loop = false;
	}
}

function random_song() {
	random++;
	if (random % 2) {
		$("#random").removeClass("text-white").addClass("text-info");
		playlist.sort(() => Math.random() - 0.5);
	} else {
		$("#random").removeClass("text-danger").addClass("text-white");
		index = songList.findIndex((x) => x.song_name == playlist[index].song_name);
		// load_playlist()
		playsong();
	}
}

function load_playlist() {
	if (random % 2) {
		track[0].src = playlist[index].song_url;
		$(
			"#current_song"
		)[0].innerHTML = `<h5 style="margin: 5px">NOW PLAYING:</h5><p>${playlist[index].song_name}</p> <p>${playlist[index].artist_name}</p>`;
	} else {
		track[0].src = songList[index].song_url;
		$(
			"#current_song"
		)[0].innerHTML = `<h5 style="margin: 5px">NOW PLAYING:</h5> <p>${songList[index].song_name}</p> <p>${songList[index].artist_name}</p>`;
	}
}
load_playlist();

// next song
function next_song() {
	loop = 0;
	track[0].loop = false;
	if (index < songList.length - 1) {
		$("#repeating").removeClass().addClass("fas fa-repeat-alt");
		index += 1;
		load_playlist();
		reset_slider();
		playsong();
	} else {
		index = 0;
		load_playlist();
		reset_slider();
		playsong();
	}
}

// previous song
function previous_song() {
	loop = 0;
	track[0].loop = false;
	$("#repeating").removeClass().addClass("fas fa-repeat-alt");
	if (index > 0) {
		index -= 1;
		load_playlist();
		playsong();
	} else {
		index = songList.length;
		load_playlist();
		playsong();
	}
}

function reset_slider() {
	slider[0].value = 0;
}

function updateTrackTime() {
	let currTimeDiv = $("#current_time");
	let durationDiv = $("#show_duration");
	let currTime = Math.floor(track[0].currentTime).toString();
	let duration = Math.floor(track[0].duration).toString();
	currTimeDiv[0].innerHTML = formatSecondsAsTime(currTime);

	if (track[0].currentTime == 0) {
		slider[0].value = "0";
	} else {
		slider[0].value =
			(track[0].currentTime / track[0].duration) * (100).toString();
	}
	if (isNaN(duration)) {
		durationDiv[0].innerHTML = "00:00";
	} else {
		durationDiv[0].innerHTML = formatSecondsAsTime(duration);
	}
}

function justplay() {
	if (Playing_song == false) {
		playsong();
	} else {
		pausesong();
	}
}

function playsong() {
	track[0].play();
	Playing_song = true;
	play[0].innerHTML =
		"<span class='fa-stack'><i class='fas fa-circle fa-stack-2x text-white'></i><i class='fa fa-pause fa-stack-1x' aria-hidden='true'></i></span>";
}

function pausesong() {
	track[0].pause();
	Playing_song = false;
	play[0].innerHTML =
		"<span class='fa-stack'><i class='fas fa-circle fa-stack-2x text-white'></i><i class='fa fa-play fa-stack-1x' aria-hidden='true'></i></span>";
}

function audio_end() {
	index++;
	load_playlist();
	reset_slider();
	playsong();
}

function change_duration() {
	slider_position = track[0].duration * (slider[0].value / 100);
	track[0].currentTime = slider_position;
}

function volume_change() {
	displayVolume[0].innerHTML = volume[0].value;
	track[0].volume = volume[0].value / 100;
	vol = volume[0].value;
}

function mute_sound() {
	ismute++;
	if (ismute % 2) {
		$("#vol-mute").removeClass().addClass("fas fa-volume-mute");
		track[0].volume = 0;
		volume[0].value = 0;
		displayVolume[0].innerHTML = volume[0].value;
	} else {
		if (vol !== 80) {
			$("#vol-mute").removeClass().addClass("fa fa-volume-up");
			volume[0].value = vol;
			track[0].volume = volume[0].value / 100;
			displayVolume[0].innerHTML = volume[0].value;
		} else {
			$("#vol-mute").removeClass().addClass("fa fa-volume-up");
			volume[0].value = 80;
			track[0].volume = volume[0].value / 100;
			displayVolume[0].innerHTML = volume[0].value;
		}
	}
}

function formatSecondsAsTime(secs, format) {
	let hr = Math.floor(secs / 3600);
	let min = Math.floor((secs - hr * 3600) / 60);
	let sec = Math.floor(secs - hr * 3600 - min * 60);
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	return min + ":" + sec;
}
