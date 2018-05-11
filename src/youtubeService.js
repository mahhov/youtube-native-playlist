const fs = require('fs');
const ytRepo = require('./youtubeRepository');
const $tream = require('bs-better-stream');
const promiseCreator = require('./promiseCreator');

let playlistLength = id => {
    let firstPage = $tream();
    firstPage.writePromise(ytRepo.getPlaylistPage(id, ''));
    return firstPage.pluck('pageInfo').pluck('totalResults');
};

let streamPlaylistVideos = id => {
    let pages = $tream();
    let responses = pages
        .map(page => ytRepo.getPlaylistPage(id, page))
        .wait();
    responses
        .pluck('nextPageToken')
        .filter(nextPage => nextPage)
        .to(pages);
    pages.write('');
    return responses
        .pluck('items')
        .flatten()
        .pluck('snippet')
        .map(snippet => ({id: snippet.resourceId.videoId, title: snippet.title, thumbnail: snippet.thumbnails && snippet.thumbnails.default.url}));
};

let downloadVideo = video => {
    let promiseWrap = promiseCreator();

    let errorHandler = error => {
        console.log('3rr', error);
        console.log('video not downloaded', video.id, video.title);
        video.status = 'failed to download';
        promiseWrap.reject();
    };

    try {
        fs.existsSync('downloads') || fs.mkdirSync('downloads');

        let stream = ytRepo.getVideoStream(video.id);
        stream.pipe(fs.createWriteStream(`downloads/${video.id}.webm`));

        video.status = 'preparing download';
        let sizeFormat = size => `${(size / 1024 / 1024).toFixed(2)} MB`;
        let timeFormat = time => `${time.toFixed(2)} seconds`;
        let startTime;

        stream.once('response', () => {
            startTime = Date.now();
            video.status = 'beginning download';
        });

        // todo handling error
        stream.on('error', errorHandler);

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

    } catch (error) {
        errorHandler(error);
    }
    return promiseWrap.promise;
};

module.exports = {playlistLength, streamPlaylistVideos, downloadVideo};
