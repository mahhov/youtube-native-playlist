let template = require('fs').readFileSync(`${__dirname}/playlistTile.html`, 'utf8');

let controller = source => {
};

let parameters = ['playlist'];

module.exports = {template, controller, parameters};
