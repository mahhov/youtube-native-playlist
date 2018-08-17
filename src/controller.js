const storage = require('./backend/storage/storageService');
const Playlist = require('./backend/youtube/Playlist');

const bb = require('bb-better-binding')();
bb.declareBlock('tab', require('./tab/tab'));
bb.declareBlock('playlistTile', require('./synchronize/palylistTile'));
const source = bb.boot(document.firstElementChild, window);

// tabs

source.setSelectedTab = tab =>
	source.selectedTab = tab;

// synchronize tab

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

let init = () => {
	source.setSelectedTab('synchronize');
	source.refreshPlaylistIds();
};

init();
