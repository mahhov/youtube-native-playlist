const storageRepo = require('./storageRepository');
const mem = require('bm-better-memoization');

const PLAYLIST_IDS_KEY = 'playlists';

let getPlaylistIds = mem(() => {
	let playlists = storageRepo.getObj(PLAYLIST_IDS_KEY);
	return Array.isArray(playlists) ? playlists : [];
});

let addPlaylistId = playlistId => {
	let playlistIds = getPlaylistIds();
	playlistIds.push(playlistId);
	storageRepo.setObj(PLAYLIST_IDS_KEY, playlistIds);
	getPlaylistIds.clear();
};

let clearPlaylistIds = () =>
	storageRepo.setObj(PLAYLIST_IDS_KEY, []);

module.exports = {getPlaylistIdsm, addPlaylistId, clearPlaylistIds};
