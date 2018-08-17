const storageRepo = require('./storageRepo');
const mem = require('bm-better-memoization');

const PLAYLIST_IDS_KEY = 'playlists';

let getPlaylistIds = mem(() => {
	let ids = storageRepo.getObj(PLAYLIST_IDS_KEY);
	return Array.isArray(ids) ? ids : [];
});

let addPlaylistId = playlistId => {
	let ids = getPlaylistIds();
	if (ids.some(id => id === playlistId))
		return;
	ids.push(playlistId);
	storageRepo.setObj(PLAYLIST_IDS_KEY, ids);
	getPlaylistIds.clear();
	return true;
};

let removePlaylistId = playlistId => {
	let ids = getPlaylistIds();
	let modifiedIds = ids.filter(id => id !== playlistId);
	if (modifiedIds.length === ids.length)
		return;
	storageRepo.setObj(PLAYLIST_IDS_KEY, modifiedIds);
	getPlaylistIds.clear();
	return true;
};

let clearPlaylistIds = () =>
	storageRepo.setObj(PLAYLIST_IDS_KEY, []);

module.exports = {getPlaylistIds, addPlaylistId, removePlaylistId: removePlaylistId, clearPlaylistIds};
