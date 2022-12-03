import tick from '../stuff/tick.js';
const time = document.getElementById('time');

function pad(n) {
    return String(n).padStart(2, '0');
}

const ticker = tick(() => {
    const date = new Date();
    time.innerText = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${pad(date.getFullYear())}, ` + 
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}, 1000);

function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}

const phrases = [
    [ 'start', function() { ticker.paused = false; } ],
    [ 'stop', function() { ticker.paused = true; } ],
    [
        'edit',
        function() {
            ticker.paused = true;
            document.body.contentEditable = 'true';
        }
    ]
];
const progressMap = new Map(phrases.map(phrase => [phrase[0], 0]));

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (key.toLowerCase() === 'f') {
        if (!ticker.paused) {
            toggleFullScreen();
        }
    }

    phrases.forEach(([phrase, handler]) => {
        const progress = progressMap.get(phrase);

        if (phrase[progress] === key) {
            progressMap.set(phrase, progress + 1);
        } else {
            progressMap.set(phrase, 0);
        }

        if (phrase.length === (progress + 1)) {
            handler();
            progressMap.forEach((v, k) => progressMap.set(k, 0));
        }

        console.log(phrase, progress);
    });
})