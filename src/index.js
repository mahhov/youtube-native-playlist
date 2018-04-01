const {app, BrowserWindow} = require('electron');
const electron = require('electron');

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
});
