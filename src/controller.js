const source = require('bb-better-binding')(__dirname, document);
const yt = require('./youtubeService');

window.source = source;

source.downloadVideo = video => {
    try {
        return yt.downloadVideo(video);
    } catch (e) {
    }
};

let init = () => {
    source.videos = [];
    let throttled = yt.streamPlaylistVideos('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2')
        .map(video => {
            source.videos.push(video);
            return source.videos[source.videos.length - 1];
        }).throttle(100);

    throttled.stream
        .map(source.downloadVideo)
        .wait()
        .each(() => {
            throttled.next();
        });

    // .wait()
    // .map(info =>
    //     ytdl.filterFormats(info.formats, 'audioonly'))
    // .
};

init();

// todo
// on click video row -> donwload that one
// on click all button -> download all
// catagorize downloads into directories
// play


// let videoId = 'gciHaTI4FIs';
// source.download(videoId);
// let p = ytdl.getInfo(videoId);
// p.then(info => {
//     window.formats = ytdl.filterFormats(info.formats, 'audioonly');
//     window.info = info;
//     console.log(window.formats);
// });
