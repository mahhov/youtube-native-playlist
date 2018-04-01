const axios = require('axios');
const _ = require('bu-better-underscore');
const apiUrl = 'https://www.googleapis.com/youtube/v3';
const apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';

let getPlaylistVideos = async id => {
    let nextPage = '';
    let videos = _([]);
    do {
        let playlistPage = await getPlaylistPage(id, nextPage);
        nextPage = playlistPage.nextPageToken;
        videos = videos.union(playlistPage.items);
        nextPage = '';
    } while (nextPage);
    return videos
        .pluck('contentDetails')
        .pluck('videoId')
        .value;
};

let getPlaylistPage = (id, page) =>
    axios.get(`${apiUrl}/playlistItems?part=contentDetails&maxResults=50&pageToken=${page}&playlistId=${id}&key=${apiKey}`)
        .then(response => response.data);

module.exports = {getPlaylistVideos};
