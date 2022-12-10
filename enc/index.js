import Data from "../stuff/data.js";
import { Key, encrypt, decrypt } from "../stuff/crypto.js";

const salt = Data.fromString('This can be anything, and I have chosen for it to be this sentence. (amogus)');

const passwordInput = document.getElementById('password');
const toEncryptInput = document.getElementById('to-encrypt');
const toDecryptInput = document.getElementById('to-decrypt');
const keyGenButton = document.getElementById('keygen');
const showKeyButton = document.getElementById('show-key');
const encrypted = document.getElementById('encrypted');
const decrypted = document.getElementById('decrypted');

const key = new Key();

keyGenButton.addEventListener('click', async () => {
    const password = passwordInput.value;
    console.log(password);
    key.init(password, salt);
});

showKeyButton.addEventListener('click', async () => {
    if (!key.isReady()) return;

    const keyData = Data.fromArrayBuffer(await crypto.subtle.exportKey('raw', key.key));
    prompt(`key and iv: `, `${keyData.hex} ${key.iv.hex}`);
})

toEncryptInput.addEventListener('input', async () => {
    if (!key.isReady()) return;

    if (toEncryptInput.value === "") {
        encrypted.innerText = '';
        return;
    };

    try {
        const result = await encrypt(key, Data.fromString(toEncryptInput.value));
        encrypted.innerText = result.hex;
    } catch (error) {
        console.error(error);
        alert(`Encryption failed: ${error}`);
    }
});

toDecryptInput.addEventListener('change', async () => {
    if (!key.isReady()) return;
    
    if (toDecryptInput.value === "") return;
    
    try {
        const result = await decrypt(key, Data.fromHex(toDecryptInput.value));
        decrypted.innerText = result.string;
    } catch (error) {
        console.error(error);
        alert(`Decryption failed: ${error || "Incorect key/input"}`);
    }
});