const source = require('bb-better-binding')(__dirname, document);
const $tream = require('bs-better-stream');
const ytService = require('./youtubeService');
const fileService = require('./fileService');

window.source = source;

source.showDownload = status => !status;

source.download = video => {
    video.status = 'download pending';
    ytService.downloadVideo(video);
};

let init = (playlistId, downloadDirectory) => {
    ytService.playlistLength(playlistId)
        .each(length => source.videoCount = length);

    source.downloads = $tream();
    fileService.walk(downloadDirectory)
        .to(source.downloads);

    source.videos = $tream();
    ytService.streamPlaylistVideos(playlistId)
        .to(source.videos);

    source.videos
        .productX(source.downloads, ({id}) => id, downloaded => downloaded.replace('.webm', ''), video => {
            video.status = 'already downloaded';
        });
};

init('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2', 'downloads');  // todo, params to be user input

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
