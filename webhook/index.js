import { Key, decrypt } from '../stuff/crypto.js';
import Data from '../stuff/data.js';
const salt = Data.fromString('This can be anything, and I have chosen for it to be this sentence. (amogus)');
const baseWebhookURL = 'https://discord.com/api/webhooks/';
const webhookParams = '?wait=true'
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
        webhook = baseWebhookURL + (await decrypt(key, Data.fromBase64(webhookEncrypted))).string + webhookParams;
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
    
    const date = new Date();
    fetch(webhook, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async res => {
        if (res.status !== 200) {
            alert(`Discord returned with a status code of ${res.status}, you fucked up`);
            return;
        }

        const data = await res.json();
        
        response.innerText += `${data.timestamp} ${data.id}\n`;

        console.log(data);
    });
});