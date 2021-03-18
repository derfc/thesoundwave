let previous = $('#previous')
let play = $('#play')
let next = $('#next')
// let title = $('#title');
let volume = $('#volume');
let displayVolume = $('#volume_show');
let slider = $('#duration_slider');
let show_duration = $('#show_duration');
let track = $('#myTrack')
let current_time = $('#current_time')
// let track_image = $('#track_image');
// let present = $('#present');
// let total = $('#total');
// let artist = $('#artist');

let Playing_song = false;

// // function update() {
// //     console.log(track[0].duration)
// //     setTimeout(function () {
// //         console.log("sto", track[0].duration)
// //         var minutes = pad(parseInt(track[0].duration / 60));
// //         var seconds = pad(parseInt(track[0].duration % 60));
// //         show_duration[0].innerHTML = `<span>${minutes + ':' + seconds}</span>`
// //     }, 500)

// // }
// // function pad(d) {
// //     return (d < 10) ? '0' + d.toString() : d.toString();
// // }
// update()


function updateTrackTime() {
    var currTimeDiv = $('#current_time');
    var durationDiv = $('#show_duration');

    var currTime = Math.floor(track[0].currentTime).toString();
    var duration = Math.floor(track[0].duration).toString();

    currTimeDiv[0].innerHTML = formatSecondsAsTime(currTime);

    if (isNaN(duration)) {
        durationDiv[0].innerHTML = '00:00';
    }
    else {
        durationDiv[0].innerHTML = formatSecondsAsTime(duration);
    }
}

function formatSecondsAsTime(secs, format) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));
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

function range_slider() {
    let position = 0;
    // update slider position
    if (!isNaN(track[0].duration)) {
        position = track[0].currentTime * (100 / track[0].duration);
        slider[0].value = position;
    }

    // function will run when the song is over
    if (track[0].ended) {
        play[0].innerHTML = "<span class='fa-stack'><i class='fas fa-circle fa-stack-2x text-warning'></i><i class='fa fa-play fa-stack -1x' aria-hidden='true'></i></span>";
        // if (autoplay == 1) {
        //     index_no += 1;
        //     load_track(index_no);
        //     playsong();
        // }
    }
}