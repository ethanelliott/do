'use strict';
const fs = require("fs");
const AutoLaunch = require("auto-launch");
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
    let autoLaunch = new AutoLaunch({
        name: 'DO',
        path: app.getPath('exe')
    });
    autoLaunch.isEnabled().then(isEnabled => {
        if (!isEnabled) autoLaunch.enable();
    });

    const activeWindows = [];
    plugins.on('update', () => {
        loadTrayMenu(plugins.getAll());
        activeWindows.forEach(w => w.send('plugins', plugins.serialize()))
    });

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

    ipcMain.on('register-self', (event) => {
        activeWindows.push(event.sender);
    });

    ipcMain.on('plugins', (event) => {
        event.reply('plugins', plugins.serialize());
    });

    ipcMain.on('main-docs', (event) => {
        event.reply('main-docs', fs.readFileSync('./src/main-docs.md', 'utf-8'));
    });

    loadTrayMenu(plugins.getAll());
}

// prevent session from closing
app.on('window-all-closed', () => {
});

app.whenReady().then(main).catch(err => console.error(err));
