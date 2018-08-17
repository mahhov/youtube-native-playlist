const bb = require('bb-better-binding')();
bb.declareBlock('tab', require('./tab/tab'));
bb.declareBlock('synchronize', require('./synchronize/controller'));
bb.declareBlock('playlistTile', require('./synchronize/palylistTile'));
const source = bb.boot(document.firstElementChild, window);

source.setSelectedTab = tab =>
	source.selectedTab = tab;

let init = () => {
	source.setSelectedTab('synchronize');
};

init();
