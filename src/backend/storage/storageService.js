const storageRepo = require('./storageRepository');
const mem = require('bm-better-memoization');

const PLAYLIST_IDS_KEY = 'playlists';

let getPlaylistIds = mem(() => {
	let ids = storageRepo.getObj(PLAYLIST_IDS_KEY);
	return Array.isArray(ids) ? ids : [];
});

let addPlaylistId = playlistId => {
	let ids = getPlaylistIds();
	ids.push(playlistId);
	storageRepo.setObj(PLAYLIST_IDS_KEY, ids);
	getPlaylistIds.clear();
};

let removePlaylistId = playlistId => {
	let ids = getPlaylistIds();
	let removeIndex = ids.findIndex(id => id !== playlistId);
	ids.splice(removeIndex, 1);
	storageRepo.setObj(PLAYLIST_IDS_KEY, ids);
	getPlaylistIds.clear();
};

let clearPlaylistIds = () =>
	storageRepo.setObj(PLAYLIST_IDS_KEY, []);

module.exports = {getPlaylistIds, addPlaylistId, removePlaylistId: removePlaylistId, clearPlaylistIds};
