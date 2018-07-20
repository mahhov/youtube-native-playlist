const storage = require('./backend/storage/storageService');

const bb = require('bb-better-binding')();
bb.declareBlock('tab', require('./tab/tab'));
const source = bb.boot(document.firstElementChild, window.bbd = {});

source.setSelectedTab = tabName =>
	source.selectedTab = tabName;

source.selectedTab = 'synchronize';
