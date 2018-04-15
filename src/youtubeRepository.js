const ytdl = require('ytdl-core');
const axios = require('axios');
const apiUrl = 'https://www.googleapis.com/youtube/v3';
const apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';
const mem = require('bm-better-memoization');

let getPlaylistPage = mem(
    (id, page) =>
        axios.get(`${apiUrl}/playlistItems?part=snippet&maxResults=50&pageToken=${page}&playlistId=${id}&key=${apiKey}`)
            .then(response => response.data));

let getVideoStream = mem(
    id =>
        ytdl(id, {quality: 'lowest'}));

module.exports = {getPlaylistPage, getVideoStream};
