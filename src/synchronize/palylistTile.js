const template = require('fs').readFileSync(`${__dirname}/playlistTile.html`, 'utf8');

let controller = source => {
	// source.fetch = fetchHandler;
	// source.download = downloadHandler;
	source.remove = () => {
		console.log('removed', source.playlist.id); // todo use ui notification instead of console.log
		source.removeHandler(source.playlist.id);
	};
};

let parameters = ['playlist', 'removeHandler'];

module.exports = {template, controller, parameters};
