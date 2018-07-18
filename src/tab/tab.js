let template = require('fs').readFileSync(`${__dirname}/tab.html`, 'utf8');

let controller = source => {
	source.click = () =>
		source.callback(source.name.toLowerCase());
};

let parameters = ['name', 'callback'];

module.exports = {template, controller, parameters};
