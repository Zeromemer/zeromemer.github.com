import tick from '../stuff/tick.js'
const time = document.getElementById('time');
const fullScreenButton = document.getElementById('fullscreen_btn');

function pad(n) {
    return String(n).padStart(2, '0');
}

tick(() => {
    const date = new Date();
    time.innerText = `${pad(date.getDate())}/${pad(date.getMonth())}/${pad(date.getFullYear())}, ` + 
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}, 1000);

let fullScreen = false;
fullScreenButton.onclick = () => {
    console.log(fullScreen);
    if (document.fullscreenElement === null) document.body.requestFullscreen();
    else document.exitFullscreen();
    fullScreen = !fullScreen;
}