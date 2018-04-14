const ytdl = require('ytdl-core');
const fs = require('fs');
const axios = require('axios');
const promiseCreator = require('./promiseCreator');
const apiUrl = 'https://www.googleapis.com/youtube/v3';
const apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';

let getPlaylistPage = (id, page) =>
    axios.get(`${apiUrl}/playlistItems?part=snippet&maxResults=50&pageToken=${page}&playlistId=${id}&key=${apiKey}`)
        .then(response => response.data);

let getVideoStream = id =>
    ytdl(id, {quality: 'lowest'});

module.exports = {getPlaylistPage, getVideoStream};
