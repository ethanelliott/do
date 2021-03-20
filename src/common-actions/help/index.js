const {BrowserWindow} = require('electron');
const {openWindowOnCursorScreen, getIcon} = require("../../util");

let helpWindow = null;

const openHelpWindow = () => {
    if (helpWindow === null) {
        helpWindow = new BrowserWindow({
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
        helpWindow.setIcon(getIcon());
        helpWindow.loadFile(`${__dirname}/index.html`);
        helpWindow.on('closed', () => {
            helpWindow = null;
        });
    }
    openWindowOnCursorScreen(helpWindow);
}

module.exports = {openHelpWindow};
