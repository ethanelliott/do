'use strict';
const {app, BrowserWindow, screen, ipcMain, globalShortcut} = require('electron');
const glob = require('glob');

const WIDTH = 600;
const HEIGHT = 80;

let win = null;

const plugins = {} // key is prefix, object is command handler

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

    win.webContents.openDevTools({mode: "detach", activate: false})

    win.on('show', () => {
        setTimeout(() => {
            app.focus({steal: true});
            win.focus();
            win.focusOnWebView();
        }, 200);
    });

    win.on('closed', () => {
        win = null;
    });
    const point = screen.getCursorScreenPoint();
    const {bounds} = screen.getDisplayNearestPoint(point);
    win.setPosition(bounds.x + (bounds.width / 2) - (WIDTH / 2),
        bounds.y + (bounds.height / 2) - (HEIGHT / 2),);
    win.show();
}

const loadPlugins = () => {
    const pluginPaths = glob.sync(`${__dirname}/plugins/**/index.js`);
    pluginPaths.forEach(pluginFile => {
        try {
            const {command} = require(pluginFile);
            const x = new command();
            console.log(`Registering Plugin:\n\tname: ${x.name}\n\tdescription: ${x.description}\n\tprefix: ${x.prefix}`);
            if (!plugins.hasOwnProperty(x.prefix)) {
                plugins[x.prefix] = x;
            } else {
                throw new Error(`Cannot register plugin '${x.name}' with prefix: '${x.prefix}', it already exists!`);
            }
        } catch (e) {
            console.error(`Unable to load plugin: `, e);
        }
    });
}

const closeWindow = () => {
    try {
        win.close();
    } catch (e) {
        console.log(e);
    }
}

const doAction = (commandString) => {
    const tokens = commandString.split(' ');
    if (tokens.length === 0) {
        console.error('invalid command!');
    }
    if (plugins.hasOwnProperty(tokens[0])) {
        try {
            plugins[tokens[0]].handler(commandString);
        } catch (e) {
            console.error(`[${tokens[0]}] ${e}`);
        }
    }
}

const main = async () => {
    loadPlugins();

    globalShortcut.register('Alt+Space', () => {
        showWindow();
    });
}


ipcMain.on('run', (event, arg) => {
    doAction(arg);
    closeWindow();
})

app.on('browser-window-blur', () => {
    // closeWindow();
});

app.on('window-all-closed', () => {
});


app.whenReady().then(main).catch(err => console.error(err));
