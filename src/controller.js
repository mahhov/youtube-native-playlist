const source = require('bb-better-binding')(__dirname, document);
const $tream = require('bs-better-stream');
const ytService = require('./youtubeService');
const fileService = require('./fileService');
const shortcut = require('./shortcut.js');

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

// visibility

source.showDownload = video => video.state === State.UNDOWNLOADED;
source.showPlay = video => video.state === State.DOWNLOADED;
source.setFilter = filter => source.filter = filter;
source.showVideo = (video, filter) => filter(video);

// downlaoding

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

// playing

let playMultiple;

source.playOne = video => {
    playMultiple = false;
    source.playVideo = video;
};

source.playAll = () => {
    playMultiple = true;
    source.nextVideo();
};

source.nextVideo = () => {
    if (!playMultiple)
        return;

    let downloadedVideos = source.videos.filter(source.filters.downloaded).outValues;
    let getRandomIndex = () => parseInt(Math.random() * downloadedVideos.length);
    let getNextIndex = () => source.playIndex === undefined || source.playIndex === downloadedVideos.length - 1 ? 0 : source.playIndex + 1;
    source.playIndex = source.shuffle ? getRandomIndex() : getNextIndex();

    source.playVideo = downloadedVideos[source.playIndex];
};

source.setShuffle = shuffle => source.shuffle = shuffle;

// youtube link

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
        .set('state', () => State.UNDOWNLOADED)
        .set('number', (_, number) => number)
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

    source.getFilterCount = (videoOutValues, filter) => videoOutValues.filter(filter).length;
};

init('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2', 'downloads');  // todo, params to be user input

// shortcuts

shortcut.listen();

shortcut.register(shortcut.Key.PLAY, () => {
    if (!source.playVideo)
        source.playAll();
    else
        source.audio.paused ? source.audio.play() : source.audio.pause();
});

shortcut.register(shortcut.Key.NEXT, source.playAll);

// todo
// styling for radio buttons
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
