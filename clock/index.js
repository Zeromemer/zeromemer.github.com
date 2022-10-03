import tick from '../stuff/tick.js';
const time = document.getElementById('time');

function pad(n) {
    return String(n).padStart(2, '0');
}

tick(() => {
    const date = new Date();
    time.innerText = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${pad(date.getFullYear())}, ` + 
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}, 1000);