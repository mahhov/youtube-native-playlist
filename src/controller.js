const source = require('bb-better-binding')(__dirname, document);
const yt = require('./youtubeService');

let x = () => {
    source.videos = [];
    yt.streamPlaylistVideos('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2')
        .each(video => {
            source.videos.push(video);
        });
};

yy = () => {
    console.log('hi there');
};

x();
