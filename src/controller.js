const source = require('bb-better-binding')(__dirname, document);
const $tream = require('bs-better-stream');
const ytService = require('./youtubeService');
const fileService = require('./fileService');

window.source = source;

source.downloads = $tream();
source.videos = $tream();
source.videosFilteredAll = $tream();
source.videosFilteredDownloaded = $tream();
source.videosFilteredUndownloaded = $tream();
source.videosFilteredDownloading = $tream();

let State = {
    UNDOWNLOADED: 0,
    DOWNLOADING: 1,
    DOWNLOADED: 2
};

// filter buttons

source.setFilterAll = () => {
    source.filteredVideos = $tream();
    source.videosFilteredAll.to(source.filteredVideos);
    // source.filteredVideos = source.videosFilteredAll;
};
source.setFilterDownloaded = () => {
    source.filteredVideos = $tream();
    source.videosFilteredDownloaded.to(source.filteredVideos);
};
source.setFilterUndownloaded = () => {
    source.filteredVideos = $tream();
    source.videosFilteredUndownloaded.to(source.filteredVideos);
};
source.setFilterDownloading = () => {
    source.filteredVideos = $tream();
    source.videosFilteredDownloading.to(source.filteredVideos);
};

// show

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

    source.downloads = fileService.walk(downloadDirectory);

    source.videos = ytService.streamPlaylistVideos(playlistId);

    source.videos
        .each(video => video.state = State.UNDOWNLOADED)
        .productX(source.downloads, ({id}) => id, download => download.replace('.webm', ''), video => {
            video.status = 'already downloaded';
            video.state = State.DOWNLOADED;
        });

    initFilteredVideos();

    source.setFilterAll();
};

let initFilteredVideos = () => {
    let videosFilterAll = [State.UNDOWNLOADED, State.DOWNLOADING, State.DOWNLOADED];
    let videosFilterDownloaded = [State.DOWNLOADED];
    let videosFilterUndownloaded = [State.UNDOWNLOADED, State.DOWNLOADING];
    let videosFilterDownloading = [State.DOWNLOADING];

    let createVideoFilter = filter => video => filter.includes(video.state);

    source.videos
        .filter(createVideoFilter(videosFilterAll))
        .to(source.videosFilteredAll);
    source.videos
        .filter(createVideoFilter(videosFilterDownloaded))
        .to(source.videosFilteredDownloaded);
    source.videos
        .filter(createVideoFilter(videosFilterUndownloaded))
        .to(source.videosFilteredUndownloaded);
    source.videos
        .filter(createVideoFilter(videosFilterDownloading))
        .to(source.videosFilteredDownloading);
};

init('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2', 'downloads');  // todo, params to be user input

// todo
// catagorize downloads into directories
// play
// show num pending downloaded summary of statuss
// throttle download all
// cancel download
// styling for radio buttons

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
