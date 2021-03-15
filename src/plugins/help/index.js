const {openWindowOnCursorScreen} = require("../../util");
const {BaseCommand} = require('../base-command');
const {BrowserWindow} = require('electron');

class Help extends BaseCommand {
    constructor() {
        super();
        this.name = 'Help Menu';
        this.description = 'AH! WHAT DO I DO?!';
        this.prefix = 'help';
    }

    handler(c) {
        super.handler(c);
        this.openHelpWindow();
    }

    openHelpWindow() {
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

module.exports = {command: Help};
