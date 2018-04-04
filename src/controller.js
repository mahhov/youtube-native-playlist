const source = require('bb-better-binding')(__dirname, document);
const yt = require('./youtubeService');

yy = () => {
    console.log('hi there');
};

let init = () => {
    source.videos = [];
    yt.streamPlaylistVideos('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2')
        .each(video => {
            source.videos.push(video);
        });
};

init();

// todo
// on click video row -> donwload that one
// on click all button -> download all
// catagorize downloads into directories
// play
