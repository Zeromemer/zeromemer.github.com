import tick from '../stuff/tick.js';

const userLocale =
  navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;

const time = document.getElementById('time');
const date = document.getElementById('date');

function pad(n) {
    return String(n).padStart(2, '0');
}

const ticker = tick(() => {
    const datetime = new Date();
    time.innerText = `${pad(datetime.getHours())}:${pad(datetime.getMinutes())}:${pad(datetime.getSeconds())}`;
    date.innerText = datetime.toLocaleDateString(userLocale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
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
        'unedit',
        function() {
            ticker.paused = false;
            time.contentEditable = 'false';
            date.contentEditable = 'false';
        }
    ],
    [
        'edit',
        function() {
            ticker.paused = true;
            time.contentEditable = 'true';
            date.contentEditable = 'true';
        }
    ]
];
const progressMap = new Map(phrases.map(phrase => [phrase[0], 0]));

document.addEventListener('keydown', (e) => {
    const code = e.code;

    if (!code.startsWith('Key')) {
        return;
    }

    const key = code.slice(3).toLocaleLowerCase();

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
    });
});