const {BrowserWindow} = require('electron');
const {openWindowOnCursorScreen, getIcon} = require("../../util");

let settingsWindow;

const openSettingsWindow = () => {
    settingsWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
        thickFrame: true,
        frame: true,
        backgroundColor: '#181818'
    });
    settingsWindow.setIcon(getIcon());
    settingsWindow.loadFile(`${__dirname}/index.html`);
    openWindowOnCursorScreen(settingsWindow);
}

module.exports = {openSettingsWindow};
