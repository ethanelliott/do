const {BaseCommand} = require('../base-command');
const {BrowserWindow, screen} = require('electron');

class Help extends BaseCommand {
    constructor() {
        super();
        this.name = 'Help Menu';
        this.description = 'AH! WHAT DO I DO?!';
        this.prefix = 'help';
    }

    handler(c) {
        super.handler(c);
        const tokens = c.split(' ');
        console.log(tokens);
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
            frame: true
        });
        win.loadFile(`${__dirname}/index.html`);
        const point = screen.getCursorScreenPoint();
        const {bounds} = screen.getDisplayNearestPoint(point);
        win.setPosition(bounds.x + (bounds.width / 2) - (400 / 2),
            bounds.y + (bounds.height / 2) - (400 / 2),);
        win.show();
    }
}

module.exports = {command: Help};
