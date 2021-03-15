const {BrowserWindow} = require('electron');
const {openWindowOnCursorScreen, getIcon} = require("../../util");

let helpWindow;

const openHelpWindow = () => {
    helpWindow = new BrowserWindow({
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
    helpWindow.setIcon(getIcon());
    helpWindow.loadFile(`${__dirname}/index.html`);
    openWindowOnCursorScreen(helpWindow);
}

module.exports = {openHelpWindow};
