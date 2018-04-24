const source = require('bb-better-binding')(__dirname, document);
const $tream = require('bs-better-stream');
const ytService = require('./youtubeService');
const fileService = require('./fileService');

window.source = source;

let State = {
    UNDOWNLOADED: 0,
    DOWNLOADING: 1,
    DOWNLOADED: 2
};

// filters

source.setFilterAll = () => source.showFilter = [State.UNDOWNLOADED, State.DOWNLOADING, State.DOWNLOADED];
source.setFilterDownloaded = () => source.showFilter = [State.DOWNLOADED];
source.setFilterUndownloaded = () => source.showFilter = [State.UNDOWNLOADED, State.DOWNLOADING];
source.setFilterDownloading = () => source.showFilter = [State.DOWNLOADING];

// show buttons

source.showVideo = video => source.showFilter.includes(video.state);
source.showDownload = video => video.state === State.UNDOWNLOADED;
source.showPlay = video => video.state === State.DOWNLOADED;

// button handlers

source.download = video => {
    video.status = 'download pending';
    video.state = State.DOWNLOADING;
    ytService.downloadVideo(video)
        .then(() => video.state = State.DOWNLOADED)
        .catch(() => video.state = State.UNDOWNLOADED);
};

source.downloadAll = () =>
    source.videos
        .filter(video => video.state === State.UNDOWNLOADED)
        .each(source.download);

source.play = video => source.playVideo = video;

source.youtubeLink = video => {
    let link = `https://www.youtube.com/watch?v=${video.id}`;
    window.open(link);
};

// init

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
        .each(video => video.state = State.UNDOWNLOADED)
        .productX(source.downloads, ({id}) => id, download => download.replace('.webm', ''), video => {
            video.status = 'already downloaded';
            video.state = State.DOWNLOADED;
        });

    source.setFilterAll();
};

init('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2', 'downloads');  // todo, params to be user input

// todo
// catagorize downloads into directories
// play
// show num pending downloaded summary of statuss
// throttle download all
// cancel download
// styling for radio buttons

// show count per filter
// tabs per playlist
// notifications on track change & download
// global key shortcuts
// homepage for playing downloaded
// audio visualization

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
