const {app, BrowserWindow, globalShortcut} = require('electron');
const electron = require('electron');
const {Key} = require('./shortcut.js');

app.on('ready', () => {
	const path = require('path');
	const url = require('url');

	let window = new BrowserWindow();

	window.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// window.setAlwaysOnTop(true, "floating", 1);
	// window.setContentSize(300,300);

	window.setMenuBarVisibility(false);
	window.maximize();
	window.toggleDevTools();

	globalShortcut.register('CmdOrCtrl+Alt+/', () => window.send('shortcut', Key.PREV));
	globalShortcut.register('CmdOrCtrl+Alt+,', () => window.send('shortcut', Key.PLAY));
	globalShortcut.register('CmdOrCtrl+Alt+.', () => window.send('shortcut', Key.NEXT));
});

// ipcRenderer.on('mini', () => {
// 	// window.setW
// });
