const {ipcRenderer} = require('electron');

let Key = {
	PREV: 0,
	PLAY: 1,
	NEXT: 2
};

let handlers = [];
let listen = () => ipcRenderer.on('shortcut', (_, key) => handlers[key] && handlers[key]());

let register = (key, handler) => handlers[key] = handler;

module.exports = {Key, register, listen};
