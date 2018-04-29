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

// show

source.showDownload = video => video.state === State.UNDOWNLOADED;
source.showPlay = video => video.state === State.DOWNLOADED;
source.setFilter = filter => source.filter = filter;
source.showVideo = (video, filter) => filter(video);

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

    source.videos = $tream();
    ytService.streamPlaylistVideos(playlistId).to(source.videos);

    source.videos
        .each(video => video.state = State.UNDOWNLOADED)
        .productX(source.downloads, ({id}) => id, download => download.replace('.webm', ''), video => {
            video.status = 'already downloaded';
            video.state = State.DOWNLOADED;
        });

    initFilters();

    source.setFilter(source.filters.all);
};

let initFilters = () => {
    let filterGroups = {
        all: [State.UNDOWNLOADED, State.DOWNLOADING, State.DOWNLOADED],
        downloaded: [State.DOWNLOADED],
        undownloaded: [State.UNDOWNLOADED, State.DOWNLOADING],
        downloading: [State.DOWNLOADING]
    };
    let createVideoFilter = filter => video => filter.includes(video.state);
    source.filters = {};
    Object.entries(filterGroups).forEach(([key, value]) => {
        source.filters[key] = createVideoFilter(value);
    });

    source.getFilterCount = (videos, filter) => videos.outValues.filter(filter).length;
};

init('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2', 'downloads');  // todo, params to be user input

// todo
// play all
// styling for radio buttons
// sticky filter tabs at top
// global key shortcuts
// notifications on track change & download
// setting for auto-downloading, showing thumbnails, and shuffle playing
// audio visualization
// homepage for playing downloaded
// catagorize downloads into directories
// throttle download all
// cancel download
// tabs per playlist


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
