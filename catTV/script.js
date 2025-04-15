"use strict";

console.log("running js");

(function() {
    // create variables for every button on the remote
    const on = document.getElementById("on-btn");
    const volUp = document.getElementById("up");
    const volDown = document.getElementById("down")
    const mute = document.getElementById('volume');

    const none = document.getElementById("no-filter");
    const baker = document.getElementById("baker");
    const boxer = document.getElementById("boxer");
    const swe = document.getElementById("swe");

    const offScreen = document.getElementById('off');

    // set states
    var power = false;
    var nofilter = true;
    var baking = false;
    var boxing = false;
    var typing = false;

    // grab filter elements
    const dough1 = document.getElementById("dough1");
    const dough2 = document.getElementById("dough2");
    const chefHat = document.getElementById("chefhat");
    const rollingPin = document.getElementById("rollingpin");

    const rightglove1 = document.getElementById("rightglove");
    const leftglove1 = document.getElementById("leftglove");
    const rightglove2 = document.getElementById("rightglove2");
    const leftglove2 = document.getElementById("leftglove2");

    const laptop1 = document.getElementById("laptop1");
    const laptop2 = document.getElementById('laptop2');

    // deal with audio
    const audioPlayer = document.getElementById('audio-player');

    // video tracker
    const nhi = document.getElementById('nhi');

    nhi.addEventListener('timeupdate', checkTimeBaking);
    nhi.addEventListener('timeupdate', checkTimeBoxing);
    nhi.addEventListener('timeupdate', checkTimeTyping);

    function checkTimeBaking() {
        const time = nhi.currentTime;
        if (baking) {
            if (Math.floor(time * 2) % 2 === 0) {
                dough1.className = 'hidden';
                dough2.className = 'showing';

                chefHat.className = 'showing';
                rollingPin.className = 'showing';

            } else {
                dough1.className = 'showing';
                dough2.className = 'hidden';

                chefHat.className = 'showing';
                rollingPin.className = 'showing';
            }
        } else {
            dough1.className = 'hidden';
            dough2.className = 'hidden';

            chefHat.className = 'hidden';
            rollingPin.className = 'hidden';
        }
    };

    function checkTimeBoxing() {
        const time = nhi.currentTime;
        if (boxing) {
            if (Math.floor(time * 2) % 2 === 0) {
                rightglove1.className = 'hidden';
                rightglove2.className = 'showing';

                leftglove1.className = 'hidden';
                leftglove2.className = 'showing';
            } else {
                rightglove1.className = 'showing';
                rightglove2.className = 'hidden';

                leftglove1.className = 'showing';
                leftglove2.className = 'hidden';
            }
        } else {
            rightglove1.className = 'hidden';
            rightglove2.className = 'hidden';

            leftglove1.className = 'hidden';
            leftglove2.className = 'hidden';
        }
    };

    function checkTimeTyping() {
        const time = nhi.currentTime;
        if (typing) {
            if (Math.floor(time * 2) % 2 === 0) {
                laptop1.className = 'hidden';
                laptop2.className = 'showing';
            } else {
                laptop1.className = 'showing';
                laptop2.className = 'hidden';
            }
        } else {
            laptop1.className = 'hidden';
            laptop2.className = 'hidden';
        }
    };

    // turn television on/off
    on.addEventListener('click', function() {
        power = !power;

    if (power) {
        offScreen.className = 'hidden';
        nofilter = true;
        baking = false;
        boxing = false;
        typing = false;

        resetFilters();

        if (nhi.paused || nhi.readyState < 3) {
            catLoad.className = 'showing';
        }

        audioPlayer.play().then(() => {
            console.log("Audio playing!");
        }).catch((e) => {
            console.log("Audio failed to play:", e);
        });

    } else {
        offScreen.className = 'showing';
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    });

    // apply the no filter function
    none.addEventListener('click', function() {
        nofilter = true;
        baking = false;
        boxing = false;
        typing = false; 

        resetFilters();
    });

    // set listener for baking button
    baker.addEventListener('click', function() {
        nofilter = false;
        boxing = false;
        typing = false;
        baking = !baking;
    });

    // set listener on boxing button
    boxer.addEventListener('click', function() {
        chefHat.className = 'hidden';
        rollingPin.className = 'hidden';

        nofilter = false;
        baking = false;
        typing = false;
        boxing = !boxing;
    });

    // set listener on typing button
    swe.addEventListener('click', function() {
        chefHat.className = 'hidden';
        rollingPin.className = 'hidden';

        nofilter = false;
        baking = false;
        boxing = false;
        typing = !typing;
    });

    // reseting filter function
    function resetFilters() {
        chefHat.className = 'hidden';
        rollingPin.className = 'hidden';
        dough1.className = 'hidden';
        dough2.className = 'hidden';

        rightglove1.className = 'hidden';
        rightglove2.className = 'hidden';
        leftglove1.className = 'hidden';
        leftglove2.className = 'hidden';

        laptop1.className = 'hidden';
        laptop2.className = 'hidden';
    };
    
    // handle volume level
    volUp.addEventListener('click', function() {
        if (power && audioPlayer.volume < 1) {
            audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
        }
    });

    volDown.addEventListener('click', function() {
        if (power && audioPlayer.volume > 0) {
            audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
        }
    });

    var muted = false;

    mute.addEventListener('click', function() {
        muted = !muted;
        if (muted) {
            audioPlayer.volume = 0;
        } else {
            audioPlayer.volume = 0.5;
        }
    })

    // handle loading

    const catLoad = document.getElementById('catload');

    nhi.addEventListener('playing', function() {
        catLoad.className = "hidden";
    })

})();