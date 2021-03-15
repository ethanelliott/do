const {app, BrowserWindow} = require('electron');
const {openWindowOnCursorScreen, getIcon} = require("./util");

const WIDTH = 600;
const HEIGHT = 80;

let win = null;

const showWindow = () => {
    if (win !== null) {
        closeWindow();
    }
    win = new BrowserWindow({
        width: WIDTH,
        height: HEIGHT,
        resizable: false,
        minimizable: false,
        maximizable: false,
        movable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        type: 'desktop',
        show: true,
        frame: false,
        focusable: true,
        thickFrame: false,
        titleBarStyle: 'hidden',
        transparent: true,
        alwaysOnTop: true,
        closable: true,
        skipTaskbar: true,
        visualEffectState: 'active'
    });

    win.setAlwaysOnTop(true, 'floating', 1);
    win.setVisibleOnAllWorkspaces(true);

    win.loadFile('./src/index.html');

    win.setIcon(getIcon())

    // win.webContents.openDevTools({mode: "detach", activate: false})

    win.on('show', () => {
        setTimeout(() => {
            app.focus({steal: true});
            win.focus();
            win.focusOnWebView();
        }, 200);
    });

    win.on('blur', () => {
        closeWindow();
    });

    win.on('closed', () => {
        win = null;
    });
    openWindowOnCursorScreen(win);
}

const closeWindow = () => {
    try {
        win.close();
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    closeWindow,
    showWindow
}
