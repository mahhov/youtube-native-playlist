const template = require('fs').readFileSync(`${__dirname}/index.html`, 'utf8');
const storage = require('../backend/storage/storageService');
const Playlist = require('../backend/models/Playlist');

let controller = source => {
	source.refreshPlaylistIds = () => {
		source.playlists = storage.getPlaylistIds()
			.map(id => new Playlist(id));
	};

	source.addPlaylistId = () => {
		let id = source.playlistIdInput.value;
		if (storage.addPlaylistId(id))
			source.playlists.push(new Playlist(id));
	};

	source.removePlaylistId = id => {
		if (storage.removePlaylistId(id))
			source.playlists = source.playlists.filter(playlist => playlist.id !== id);
	};


	let init = () => source.refreshPlaylistIds();

	init();
};

let parameters = [];

module.exports = {template, controller, parameters};
