let previous = $('#previous')
let play = $('#play')
let next = $('#next')
// let title = $('#title');
let volume = $('#volume');
let displayVolume = $('#volume_show');
let slider = $('#duration_slider');
let track = $('#myTrack')
let current_time = $('#current_time')
// let track_image = $('#track_image');
// let present = $('#present');
// let total = $('#total');
// let artist = $('#artist');

let Playing_song = false;


function updateTrackTime() {
    let currTimeDiv = $('#current_time');
    let durationDiv = $('#show_duration');
    let currTime = Math.floor(track[0].currentTime).toString();
    let duration = Math.floor(track[0].duration).toString();
    currTimeDiv[0].innerHTML = formatSecondsAsTime(currTime);
    slider[0].value = Math.floor(track[0].currentTime / track[0].duration * 100).toString()

    if (isNaN(duration)) {
        durationDiv[0].innerHTML = '00:00';
    }
    else {
        durationDiv[0].innerHTML = formatSecondsAsTime(duration);
    }
}

function formatSecondsAsTime(secs, format) {
    let hr = Math.floor(secs / 3600);
    let min = Math.floor((secs - (hr * 3600)) / 60);
    let sec = Math.floor(secs - (hr * 3600) - (min * 60));
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return min + ':' + sec;
}


function justplay() {
    if (Playing_song == false) {
        playsong();
    } else {
        pausesong();
    }
}

function playsong() {
    // console.log(track)
    console.log("playing")
    track[0].play();
    Playing_song = true;
    play[0].innerHTML = "<span class='fa-stack'><i class='fas fa-circle fa-stack-2x text-warning'></i><i class='fa fa-pause fa-stack -1x' aria-hidden='true'></i></span>";
    console.log(track[0].currentTime)
}

function pausesong() {
    track[0].pause();
    Playing_song = false;
    console.log("paused")
    console.log(track[0].currentTime)
    console.log(slider[0])
    play[0].innerHTML = "<span class='fa-stack'><i class='fas fa-circle fa-stack-2x text-warning'></i><i class='fa fa-play fa-stack -1x' aria-hidden='true'></i></span>";
}

function change_duration() {
    slider_position = track[0].duration * (slider[0].value / 100);
    track[0].currentTime = slider_position;
}

function volume_change() {
    displayVolume[0].innerHTML = volume[0].value;
    track[0].volume = volume[0].value / 100;
}

