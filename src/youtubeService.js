const axios = require('axios');
const _ = require('bs-better-stream');
const apiUrl = 'https://www.googleapis.com/youtube/v3';
const apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';

let streamPlaylistVideos = id => {
    let videos = _();
    streamPlaylistPage(videos, id, '');
    return videos.map(video => ({id: video.snippet.resourceId.videoId, title: video.snippet.title}));
};

let streamPlaylistPage = async (videos, id) => {
    let nextPage = '';
    do {
        let playlistPage = await getPlaylistPage(id, nextPage);
        videos.write(...playlistPage.items);
        nextPage = playlistPage.nextPageToken;
    } while (nextPage);
};

let getPlaylistPage = (id, page) =>
    axios.get(`${apiUrl}/playlistItems?part=snippet&maxResults=4&pageToken=${page}&playlistId=${id}&key=${apiKey}`)
        .then(response => response.data);

module.exports = {streamPlaylistVideos};
