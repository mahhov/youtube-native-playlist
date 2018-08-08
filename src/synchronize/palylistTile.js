let template = require('fs').readFileSync(`${__dirname}/playlistTile.html`, 'utf8');

let controller = source => {
	source.onload = playlist =>
		console.log('loaded', playlist, source.playlist);
};

let parameters = ['playlist'];

module.exports = {template, controller, parameters};
