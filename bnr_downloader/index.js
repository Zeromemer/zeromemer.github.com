const url = document.getElementById('url-input');
const searchBtn = document.getElementById('search');
const results = document.getElementById('results');

console.log(url, searchBtn, results);

const mp3UrlRegex = /https:\/\/stream.bnr.bg\/storage\/.*\.mp3/g;

function getMp3SourcesFromUrl(url) {
    return fetch(url)
        .then(res => res.text())
        .then(text => {
            const mp3Urls = text.match(mp3UrlRegex);
            return mp3Urls;
        }).catch(err => {
            results.innerHTML = `<p>${err}</p>`;
            return [];
        });
}

searchBtn.addEventListener('click', () => {
    results.innerHTML = '';
    // put all sources into results as a list of anchors
    getMp3SourcesFromUrl(url.value).then(mp3Urls => {
        if (mp3Urls === null) {
            results.innerHTML = 'No mp3 sources found :/';
            return;
        }
        mp3Urls.forEach(mp3Url => {
            const a = document.createElement('a');
            a.href = mp3Url;
            a.textContent = mp3Url;
            const li = document.createElement('li');
            li.appendChild(a);
            
            results.appendChild(li);
        });
    });
});