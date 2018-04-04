const axios = require('axios');
const _ = require('bs-better-stream');
const apiUrl = 'https://www.googleapis.com/youtube/v3';
const apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';

let streamPlaylistVideos = id => {
    let pages = _();
    let responses = pages
        .map(page => getPlaylistPage(id, page))
        .wait();
    responses
        .pluck('nextPageToken')
        .filter(nextPage => nextPage)
        .to(pages);
    pages.write('');
    return responses
        .pluck('items')
        .flatten()
        .pluck('snippet')
        .map(snippet => ({id: snippet.resourceId.videoId, title: snippet.title}));
};

let getPlaylistPage = (id, page) =>
    axios.get(`${apiUrl}/playlistItems?part=snippet&maxResults=50&pageToken=${page}&playlistId=${id}&key=${apiKey}`)
        .then(response => response.data);

module.exports = {streamPlaylistVideos};
