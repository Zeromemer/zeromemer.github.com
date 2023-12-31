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
    const currentDate = new Date();

    const endOfYear = new Date(currentDate.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
    const secondsTillNextYear = Math.round((endOfYear - currentDate) / 1000);
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0, 0);
    const secondsSinceLastYear = Math.round((currentDate - startOfYear) / 1000);
    
    if (secondsTillNextYear <= 20) {
        date.style.display = 'none';
        if (secondsTillNextYear <= 10) time.style.fontSize = `50vh`;
        time.innerText = secondsTillNextYear;
    } else if (secondsSinceLastYear < 12) {
        date.style.display = 'none';
        time.style.fontSize = '';
        time.innerText = currentDate.getFullYear() + '!'.repeat(secondsSinceLastYear % 4);
    } else {
        date.style.display = '';
        date.innerText = currentDate.toLocaleDateString(userLocale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        time.innerText = `${pad(currentDate.getHours())}:${pad(currentDate.getMinutes())}:${pad(currentDate.getSeconds())}`;
    }
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

const letters = {
    'f': function() {
        if (!ticker.paused) {
            toggleFullScreen();
        }
    }
};

document.addEventListener('keydown', (e) => {
    const code = e.code;

    if (!code.startsWith('Key')) {
        return;
    }

    const key = code.slice(3).toLowerCase();

    const letterHandler = letters[key];
    if (letterHandler) {
        letterHandler();
        return;
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