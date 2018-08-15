const template = require('fs').readFileSync(`${__dirname}/playlistTile.html`, 'utf8');

const storage = require('../backend/storage/storageService');

let controller = source => {
	// source.fetch = fetchHandler;
	// source.download = downloadHandler;
	source.remove = () => {
		console.log('removed', source.playlist.id); // todo use ui notification instead of console.log
		if (storage.removePlaylistId(source.playlist.id))
			source.refresh();
	};
};

let parameters = ['playlist', 'refresh'];

module.exports = {template, controller, parameters};
