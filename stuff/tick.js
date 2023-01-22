/**
 * Better setInterval
 * 
 * @param {() => void} callback
 * @param {number} delay
 * @returns {{ paused: boolean, callback: () => void, delay: number, timeoutId: number }} a reference to the ticker
*/
export default function tick(callback, delay) {
    const ticker = { paused: false, callback, delay, timeoutId: NaN };

    function inner() {
        if (!ticker.paused) {
            ticker.callback();
        }
        const now = Date.now();
        ticker.timeoutId = setTimeout(inner, (Math.floor(now / ticker.delay) * ticker.delay + ticker.delay) - now);
    }
    inner();

    return ticker;
}