import { Key, decrypt } from '../stuff/crypto.js';
import Data from '../stuff/data.js';
const salt = Data.fromString('This can be anything, and I have chosen for it to be this sentence. (amogus)');
const baseWebhookURL = 'https://discord.com/api/webhooks/';
const webhookEncrypted = 'jQXKYuNvK4yaXup13VRx1QL67MiTT5HUDQcWX6uvr5tHFIFa2IkPWUTM0AnFWYbSvTvhSVCmetAMUgjlvLfzL2jzW+RievOKecKykCSGiTAXz8eDEMYM/MxE/DlhNbv6';

const password = document.getElementById('password');
const text = document.getElementById('text');
const response = document.getElementById('response');
const unlockButton = document.getElementById('unlock');
const sendButton = document.getElementById('send');

const key = new Key();

unlockButton.addEventListener('click', async () => {
    await key.init(password.value, salt);
    password.value = '';

    try {
        webhook = baseWebhookURL + (await decrypt(key, Data.fromBase64(webhookEncrypted))).string;
    } catch (error) {
        console.error(error);
        alert(`Decryption failed: ${error || "Incorect key/input"}`);
        return;
    }
});

let webhook = null;
sendButton.addEventListener('click', async () => {
    if (webhook === null) {
        alert("You haven't unlocked the webhook DINGUS");
        return;
    }

    const body = {
        content: text.value,
        allowed_mentions: {
            users: [],
            roles: [],
            everyone: false
        }
    };

    console.log(body);
    
    const date = new Date();
    fetch(webhook, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        
        response.innerText += `${hours}:${minutes}:${seconds} ${res.status}\n`;
    });
});