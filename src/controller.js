const source = require('bb-better-binding')(__dirname, document);
const ytService = require('./youtubeService');

window.source = source;

source.downloadVideo = video => {

};

let init = () => {
    ytService.playlistLength('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2')
        .each(length => {
            source.videoCount = length;
        });

    source.videos = [];
    let throttled = ytService.streamPlaylistVideos('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2') // todo paramaterize
        .map(video => {
            source.videos.push(video);
            return source.videos[source.videos.length - 1];
        }).throttle(10);

};

init();

// todo
// list which one's downloaded
// filter options by downlaoded, undownloaded, all
// on click video row -> donwload that one
// on click all button -> download all
// catagorize downloads into directories
// play

// throttled.stream
//     .map(ytService.downloadVideo)
//     .wait()
//     .each(throttled.nextOne);

// .wait()
// .map(info =>
//     ytdl.filterFormats(info.formats, 'audioonly'))
// .

// let videoId = 'gciHaTI4FIs';
// source.download(videoId);
// let p = ytdl.getInfo(videoId);
// p.then(info => {
//     window.formats = ytdl.filterFormats(info.formats, 'audioonly');
//     window.info = info;
//     console.log(window.formats);
// });
