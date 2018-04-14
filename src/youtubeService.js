const ytRepo = require('./youtubeRepository');
const $tream = require('bs-better-stream');
const promiseCreator = require('./promiseCreator');

let streamPlaylistVideos = id => {
    let pages = $tream();
    let responses = pages
        .map(page => ytRepo.getPlaylistPage(id, page))
        .wait();
    responses
        .pluck('nextPageToken')
        .filter(nextPage => nextPage)
        .filterCount(1)
        .to(pages);
    pages.write('');
    return responses
        .pluck('items')
        .flatten()
        .pluck('snippet')
        .map(snippet => ({id: snippet.resourceId.videoId, title: snippet.title}));
};

let downloadVideo = video => {
    try {
        let promiseWrap = promiseCreator();

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
        stream.on('error', err => {
            console.log('3rr', err);
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
    } catch (e) {
    }
};

module.exports = {streamPlaylistVideos, downloadVideo};
