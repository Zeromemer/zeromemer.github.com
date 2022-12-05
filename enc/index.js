import Data from "../stuff/data.js";

const salt = Data.fromString('This can be anything, and I have chosen for it to be this sentence. (amogus)');

const passwordInput = document.getElementById('password');
const toEncryptInput = document.getElementById('to-encrypt');
const toDecryptInput = document.getElementById('to-decrypt');
const keyGenButton = document.getElementById('keygen');
const showKeyButton = document.getElementById('show-key');
const encrypted = document.getElementById('encrypted');
const decrypted = document.getElementById('decrypted');

async function deriveKey(string) {
    const data = Data.fromString(string);
    const base = await crypto.subtle.importKey("raw", data.uint8Array, { name: "PBKDF2" }, false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: salt.uint8Array, iterations: 200_000, hash: 'SHA-256' },
        base,
        { name: 'AES-CBC', length: 256 },
        true,
        [ 'encrypt', 'decrypt' ]
    );
}

async function deriveIv(string) {
    const data = Data.fromArrayBuffer(await crypto.subtle.digest('SHA-256', Data.fromString(string).uint8Array));
    const hash = data.uint8Array;
    const result = new Uint8Array(16);
    for (let i = 0; i < result.length; i++) {
        result[i] = hash[i] + hash[i + result.length - 1];
    }
    return result.buffer;
}

async function encrypt(key, iv, data) {
    return Data.fromArrayBuffer(await crypto.subtle.encrypt({ name: 'AES-CBC', iv: iv.arrayBuffer }, key, data.uint8Array));
}

async function decrypt(key, iv, data) {
    return Data.fromArrayBuffer(await crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv.arrayBuffer }, key, data.uint8Array))
}

let key = null;
let iv = null;
keyGenButton.addEventListener('click', async () => {
    const password = passwordInput.value;
    console.log(password);
    key = await deriveKey(password);
    iv = Data.fromArrayBuffer(await deriveIv(password));
});

showKeyButton.addEventListener('click', async () => {
    const keyData = Data.fromArrayBuffer(await crypto.subtle.exportKey('raw', key));
    prompt(`key and iv: `, `${keyData.hex} ${iv.hex}`);
})


toEncryptInput.addEventListener('input', async () => {
    if (key ===  null || iv === null) return;

    if (toEncryptInput.value === "") {
        encrypted.innerText = '';
        return;
    };

    try {
        const result = await encrypt(key, iv, Data.fromString(toEncryptInput.value));
        encrypted.innerText = result.hex;
    } catch (error) {
        console.error(error);
        alert(`Encryption failed: ${error}`);
    }
});

toDecryptInput.addEventListener('change', async () => {
    if (key ===  null || iv === null) return;
    
    if (toDecryptInput.value === "") return;
    
    try {
        const result = await decrypt(key, iv, Data.fromHex(toDecryptInput.value));
        console.log(result.string);
        decrypted.innerText = result.string;
    } catch (error) {
        console.error(error);
        alert(`Decryption failed: ${error || "Incorect key/input"}`);
    }
});