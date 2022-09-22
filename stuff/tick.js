/**
 * Better setInterval
 * 
 * @param {() => void} callback
 * @param {number} delay
*/
export default function tick(callback, delay) {
    callback();
    const now = Date.now();
    setTimeout(() => tick(callback, delay), (Math.round(now / delay) * delay + delay) - now);
}