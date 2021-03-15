const {BaseCommand} = require('../base-command');
const {BrowserWindow, screen} = require('electron');
const {openWindowOnCursorScreen} = require("../../util");

class Settings extends BaseCommand {
    constructor() {
        super();
        this.name = 'Settings';
        this.description = 'settings window';
        this.prefix = 'settings';
    }

    handler(c) {
        super.handler(c);
        this.openSettingsWindow();
    }

    openSettingsWindow() {
        const win = new BrowserWindow({
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
        win.loadFile(`${__dirname}/index.html`);
        openWindowOnCursorScreen(win);
    }
}

module.exports = {command: Settings};
