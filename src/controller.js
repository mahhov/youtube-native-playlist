const storage = require('./backend/storage/storageService');
const Playlist = require('./backend/youtube/Playlist');

const bb = require('bb-better-binding')();
bb.declareBlock('tab', require('./tab/tab'));
bb.declareBlock('playlist-tile', require('./synchronize/palylistTile'));
const source = bb.boot(document.firstElementChild, window.bbd = {});


// tabs

source.setSelectedTab = tab =>
	source.selectedTab = tab;

// synchronize tab

let refreshPlaylistIds = () => {
	source.playlists = storage.getPlaylistIds()
		.map(id => new Playlist(id));
};

source.addPlaylistId = () => {
	storage.addPlaylistId(source.playlistIdInput.value);
	refreshPlaylistIds();
};

let init = () => {
	source.setSelectedTab('synchronize');
	refreshPlaylistIds();
};

init();
