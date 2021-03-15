'use strict';
const {closeWindow} = require("./main-window");
const {showWindow} = require("./main-window");
const {Plugins} = require("./plugins/plugins");
const {app, ipcMain, globalShortcut} = require('electron');
const {openHelpWindow} = require('./common-actions/help')
const {openSettingsWindow} = require('./common-actions/settings')
const {loadTrayMenu} = require('./tray')

const plugins = new Plugins();

const doAction = (commandString) => {
    const tokens = commandString.toLowerCase().split(' ');
    if (tokens.length === 0) {
        console.error('invalid command!');
    }
    if (plugins.has(tokens[0])) {
        try {
            plugins.handle(tokens[0], commandString);
        } catch (e) {
            console.error(`[${tokens[0]}] ${e}`);
        }
    } else {
        switch (tokens[0]) {
            case 'help':
                openHelpWindow();
                break;
            case 'settings':
                openSettingsWindow();
                break;
            default:
                console.error('UNKNOWN COMMAND');
        }
    }
}

const main = async () => {
    loadTrayMenu(plugins.getAll());
    globalShortcut.register('Alt+Space', () => {
        showWindow();
    });
    ipcMain.on('run', (event, arg) => {
        doAction(arg);
        closeWindow();
    });
    ipcMain.on('close', () => {
        closeWindow();
    });
}

// prevent session from closing
app.on('window-all-closed', () => {
});

app.whenReady().then(main).catch(err => console.error(err));
