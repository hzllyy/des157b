'use strict';

(function() {
    console.log('running js');

    // HANDLE LIGHTS ON/OFF

    var lamp = document.getElementById("lamplight");

    // store image IDs and their current modes
    const imageIDs = ["bg", "paper", "shelf", "des", "cal", "poster", "nightstand", "bedlight", "laptop", "closetlight", "miffylight", "clotheslight", "musiclight", "lamplight", "drawerlight1", "drawerlight2", "drawerlight3", "drawerlight4"];

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
    
    const linksGroups = {
        drawerlight1: Array.from(document.querySelectorAll('#group1 .link')),
        drawerlight2: Array.from(document.querySelectorAll('#group2 .link')),
        drawerlight3: Array.from(document.querySelectorAll('#group3 .link')),
        drawerlight4: Array.from(document.querySelectorAll('#group4 .link'))
    }

    function addHoverBehavior(imgEl, textEl, linkArray) {
        function handleMouseOver() {
            imgEl.classList.add('open');
            const src = imgEl.getAttribute('src');
            imgEl.setAttribute('src', src.replace('drawer', 'open'));
            textEl.classList.add('enlarge');
            linkArray.forEach(link => link.classList.remove('hidden'));
        }
    
        function handleMouseOut() {
            imgEl.classList.remove('open');
            const src = imgEl.getAttribute('src');
            imgEl.setAttribute('src', src.replace('open', 'drawer'));
            textEl.classList.remove('enlarge');
            linkArray.forEach(link => link.classList.add('hidden'));
        }
    
        [imgEl, textEl, ...linkArray].forEach(el => {
            el.addEventListener('mouseover', handleMouseOver);
            el.addEventListener('mouseout', handleMouseOut);
        })
    }

    addHoverBehavior(drawerLight1, drawerTextMap.drawerlight1, linksGroups.drawerlight1);
    drawerLight1.classList.add('drawer-img');

    drawerIDs.forEach(id => {
        const img = document.getElementById(id);
        const text = drawerTextMap[id];
        const link = linksGroups[id];
    
        img.classList.add('drawer-img');
        addHoverBehavior(img, text, link);
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