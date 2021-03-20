const {BrowserWindow} = require('electron');
const {openWindowOnCursorScreen, getIcon} = require("../../util");

let settingsWindow = null;

const openSettingsWindow = () => {
    if (settingsWindow === null) {
        settingsWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            },
            titleBarStyle: 'hidden',
            autoHideMenuBar: true,
            thickFrame: false,
            frame: false,
            backgroundColor: '#181818',
            minWidth: 1000,
            width: 1000,
        });
        settingsWindow.setIcon(getIcon());
        settingsWindow.loadFile(`${__dirname}/index.html`);
        settingsWindow.on('closed', () => {
            settingsWindow = null;
        });
    }
    openWindowOnCursorScreen(settingsWindow);
}

module.exports = {openSettingsWindow};
