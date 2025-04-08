'use strict';

(function() {
    console.log('running js');

    // HANDLE LIGHTS ON/OFF

    var lamp = document.getElementById("lamplight");

    // store image IDs and their current modes
    const imageIDs = ["bglight", "bedlight", "closetlight", "miffylight", "clotheslight", "musiclight", "lamplight", "drawerlight1", "drawerlight2", "drawerlight3", "drawerlight4",];

    // set initial state
    let isLightOn = true;

    // event listener for switching between light on/off
    lamp.addEventListener('click', function() {
        isLightOn = !isLightOn;
        console.log("light switch has been hit!")

        imageIDs.forEach(id => {
            const img = document.getElementById(id);
            const src= img.getAttribute('src');

            // light switch
            if (isLightOn) {
                img.setAttribute('src', src.replace('-dark', '-light'));
            } else {
                img.setAttribute('src', src.replace('-light', '-dark'));
            }
        });
    });

    // HANDLE DRAWERS

    // store image IDs for drawers
    const drawerLight1 = document.getElementById("drawerlight1");
    const drawerIDs = ["drawerlight2", "drawerlight3", "drawerlight4"];

    const drawerTextMap = {
        drawerlight1: document.getElementById('text1'),
        drawerlight2: document.getElementById('text2'),
        drawerlight3: document.getElementById('text3'),
        drawerlight4: document.getElementById('text4'),
    };

    // handle special case
    drawerLight1.classList.add('drawer-img1');

    drawerLight1.addEventListener('mouseover', function() {
        drawerLight1.classList.add('open');
        const src = drawerLight1.getAttribute('src');
        drawerLight1.setAttribute('src', src.replace('drawer', 'open1'));
        drawerTextMap.drawerlight1.classList.add('enlarge');
    });

    drawerLight1.addEventListener('mouseout', function() {
        drawerLight1.classList.remove('open');
        const src = drawerLight1.getAttribute('src');
        drawerLight1.setAttribute('src', src.replace('open1', 'drawer'));
        drawerTextMap.drawerlight1.classList.remove('enlarge');
    });

    // opening and closing drawers for the rest
    drawerIDs.forEach(id => {
        const img = document.getElementById(id);
        img.classList.add('drawer-img');

        img.addEventListener('mouseover', function() {
            img.classList.add('open');
            const src= img.getAttribute('src');
            img.setAttribute('src', src.replace('drawer', 'open2'));
            drawerTextMap[id].classList.add('enlarge');
        });

        img.addEventListener('mouseout', function() {
            img.classList.remove('open');
            const src = img.getAttribute('src');
            img.setAttribute('src', src.replace('open2', 'drawer'))
            drawerTextMap[id].classList.remove('enlarge');
        });
    });

    // HANDLE RECORD PLAYER
    const music = document.getElementById("musiclight");
    const audioPlayer = document.getElementById("audio-player");

    // array for paths to different songs
    const songPaths = [
        "audios/intro.mp3",
        "audios/odoriko.mp3",
        "audios/only.mp3",
        "audios/pank.mp3",
        "audios/sunkissed.mp3"
    ];

    let shuffledSongs = [];
    let currentSongIndex = 0;
    let clickTimer = null;

    // function for shuffling
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // function for playing shuffled playlist
    function playNextSong() {
        if (currentSongIndex < shuffledSongs.length) {
            audioPlayer.src = shuffledSongs[currentSongIndex];
            audioPlayer.play();
            // increment index to move on to next song
            currentSongIndex++;
        }
    }

    // play next song if current song has ended
    audioPlayer.addEventListener('ended', playNextSong);

    // click to play song
    music.addEventListener("click", function () {
        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
            // doubleclick to pause music
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            return;
        }
    
        // delay 250 ms to ensure it is a single click
        clickTimer = setTimeout(() => {
            // click to play a random song
            shuffledSongs = shuffle([...songPaths]);
            // reset index to restart playlist
            currentSongIndex = 0;
            playNextSong();
            clickTimer = null;
        }, 250);
    });

})();