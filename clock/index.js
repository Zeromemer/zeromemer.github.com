import tick from '../stuff/tick.js'
const time = document.getElementById('time');

tick(() => time.innerText = new Date().toLocaleString(), 1000);