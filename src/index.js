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

    window.maximize();

    window.toggleDevTools();

    // globalShortcut.register('MediaPreviousTrack', () => window.send('shortcut', Key.PREV));
    globalShortcut.register('MediaPlayPause', () => window.send('shortcut', Key.PLAY));
    globalShortcut.register('MediaNextTrack', () => window.send('shortcut', Key.NEXT));
});
