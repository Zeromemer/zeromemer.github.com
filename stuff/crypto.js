import Data from "./data.js";

/**
 * @template {boolean} Ready
 */
export class Key {
    /** @type {Ready extends true ? CryptoKey : null} */
    #key = null;
    /** @type {Ready extends true ? Data : null} */
    #iv = null;

    get key() {
        return this.#key;
    }

    get iv() {
        return this.#iv;
    }

    /**
     * @returns {this is Key<true>}
     */
    isReady() {
        return this.#key !== null && this.#iv !== null;
    }

    /** 
     * @param {string} passphrase
     * @param {Data} salt
     */
    async init(passphrase, salt) {
        const passData = Data.fromString(passphrase);
        await this.initKey(passData, salt);
        await this.initIv(passData);
    }

    /** 
     * @param {Data} passData
     * @param {Data} salt
     */
    async initKey(passData, salt) {
        const base = await crypto.subtle.importKey("raw", passData.uint8Array, { name: "PBKDF2" }, false, ["deriveKey"]);
        this.#key = await crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: salt.uint8Array, iterations: 200_000, hash: 'SHA-256' },
            base,
            { name: 'AES-CBC', length: 256 },
            true,
            [ 'encrypt', 'decrypt' ]
        );
    }

    /** 
     * @param {Data} passData
     */
    async initIv(passData) {
        const data = Data.fromArrayBuffer(await crypto.subtle.digest('SHA-256', passData.uint8Array));
        const hash = data.uint8Array;
        const result = new Uint8Array(16);
        for (let i = 0; i < result.length; i++) {
            result[i] = hash[i] + hash[i + result.length - 1];
        }
        this.#iv = Data.fromUint8Array(result);
    }
}

/**
 * @param {Key<true>} key
 * @param {Data} data
 */
export async function encrypt(key, data) {
    return Data.fromArrayBuffer(await crypto.subtle.encrypt({ name: 'AES-CBC', iv: key.iv.arrayBuffer }, key.key, data.uint8Array));
}

/**
 * @param {Key<true>} key
 * @param {Data} data
 */
export async function decrypt(key, data) {
    return Data.fromArrayBuffer(await crypto.subtle.decrypt({ name: 'AES-CBC', iv: key.iv.arrayBuffer }, key.key, data.uint8Array));
}