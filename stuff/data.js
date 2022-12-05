/** Binary data wraper class */
export default class Data {
    #data;
    static encoder = new TextEncoder();
    static decoder = new TextDecoder();

    /** @param {Uint8Array} data */
    constructor(data) {
        if (data instanceof Uint8Array) {
            this.#data = data;
        } else {
            throw new TypeError('data can only be an instance of the Uint8Array class.');
        }
    }

    /** @param {Uint8Array} arr  */
    static fromUint8Array(arr) {
        return new Data(arr);
    }

    /** @param {string} string */
    static fromString(string) {
        return new Data(Data.encoder.encode(string));
    }

    /** @param {ArrayBuffer} arrBuf */
    static fromArrayBuffer(arrBuf) {
        return new Data(new Uint8Array(arrBuf));
    }

    /** @param {string} string */
    static fromHex(string) {
        return new Data(new Uint8Array(string.match(/[0-9A-Za-z]{2}/g).map(s => parseInt(s, 16))));
    }

    /** @param {string} string */
    static fromBase64(string) {
        return Data.fromString(atob(string));
    }

    get uint8Array() {
        return this.#data;
    }

    get string() {
        return Data.decoder.decode(this.#data);
    }
    
    get arrayBuffer() {
        return this.#data.buffer;
    }
    
    get hex() {
        return Array.from(this.#data).map(i => i.toString(16).padStart(2, '0')).join('');
    }

    get base64() {
        return btoa(this.string);
    }
}