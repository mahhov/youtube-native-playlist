const ytdl = require('ytdl-core');
const fs = require('fs');
const axios = require('axios');
const $tream = require('bs-better-stream');
const promiseCreator = require('./promiseCreator');
const apiUrl = 'https://www.googleapis.com/youtube/v3';
const apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';

let streamPlaylistVideos = id => {
    let pages = $tream();
    let responses = pages
        .map(page => getPlaylistPage(id, page))
        .wait();
    responses
        .pluck('nextPageToken')
        .filter(nextPage => nextPage)
        .filterCount(4)
        .to(pages);
    pages.write('');
    return responses
        .pluck('items')
        .flatten()
        .pluck('snippet')
        .map(snippet => ({id: snippet.resourceId.videoId, title: snippet.title}));
};

let getPlaylistPage = (id, page) =>
    axios.get(`${apiUrl}/playlistItems?part=snippet&maxResults=50&pageToken=${page}&playlistId=${id}&key=${apiKey}`)
        .then(response => response.data);

let downloadVideo = video => {
    let promiseWrap = promiseCreator();

    fs.existsSync('downloads') || fs.mkdirSync('downloads');

    let stream = ytdl(video.id, {quality: 'lowest'});
    stream.pipe(fs.createWriteStream(`downloads/${video.id}.webm`));

    video.status = 'preparing download';

    let sizeFormat = size => `${(size / 1024 / 1024).toFixed(2)} MB`;

    let timeFormat = time => `${time.toFixed(2)} seconds`;

    let startTime;
    stream.once('response', () => {
        startTime = Date.now();
        video.status = 'beginning download';
    });

    stream.on('progress', (chunkLength, downloaded, total) => {
        let floatDownloaded = downloaded / total;
        let secondsPassed = (Date.now() - startTime) / 1000;

        let percent = `${(floatDownloaded * 100).toFixed(2)}%`;
        let size = `${sizeFormat(total)}`;
        let time = `${timeFormat(secondsPassed / floatDownloaded - secondsPassed)} remaining`;

        video.status = `${percent} (${time}) [${size}]`;
    });

    stream.on('end', () => {
        let secondsPassed = (Date.now() - startTime) / 1000;
        let time = `${timeFormat(secondsPassed)}`;
        video.status = `done downloading (${time})`;
        promiseWrap.resolve();
    });

    return promiseWrap.promise;
};

module.exports = {streamPlaylistVideos, downloadVideo};
