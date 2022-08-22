/**
 * Better setInterval
 * 
 * @param {() => void} callback
 * @param {number} delay
*/
export default function tick(callback, delay) {
    const now = Date.now();
    callback();
    setTimeout(() => tick(callback, delay), (Math.round(now / delay) * delay + delay) - now);
}