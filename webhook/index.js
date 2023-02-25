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
const fileInput = document.getElementById('files');

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

window.addEventListener('paste', e => {
    fileInput.files = e.clipboardData.files;
});  

let webhook = null;
sendButton.addEventListener('click', async () => {
    if (webhook === null) {
        alert("You haven't unlocked the webhook DINGUS");
        return;
    }

    const message = JSON.stringify({
        content: text.value,
        allowed_mentions: {
            users: [],
            roles: [],
            everyone: false
        }
    });

    const request = { method: "POST" };
    if (fileInput.files.length) {
        const formData = new FormData();
        formData.append('payload_json', message);

        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append(`files[${i}]`, fileInput.files[i]);
        }

        request.body = formData;
        fileInput.value = '';
    } else {
        request.headers = { "Content-Type": "application/json" };
        request.body = message;
    }

    fetch(webhook, request).then(async res => {
        if (res.status !== 200) {
            alert(`Discord returned with a status code of ${res.status}, you fucked up`);
            return;
        }

        const data = await res.json();
        
        response.innerText += `${data.timestamp} ${data.id}\n`;

        console.log(data);
    });
});