const source = require('bb-better-binding')(__dirname, document);
const yt = require('./youtubeService');

let x = async () => {
    source.videos = await yt.getPlaylistVideos('PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2');
};

x();
