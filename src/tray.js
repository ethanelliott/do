const {getIcon} = require("./util");
const {Menu, Tray, MenuItem} = require('electron');

const {showWindow} = require("./main-window");
const {openSettingsWindow} = require("./common-actions/settings");
const {openHelpWindow} = require("./common-actions/help");

let tray;

const buildMenuItem = (options) => {
    return new MenuItem(options);
}

const loadTrayMenu = (plugins) => {
    tray = new Tray(getIcon());
    const template = [
        buildMenuItem({
            label: 'Help',
            click() {
                openHelpWindow()
            }
        }),
        buildMenuItem({
            type: 'separator'
        }),
        buildMenuItem({
            label: 'Plugins',
            submenu: Object.keys(plugins).map(p => ({
                label: plugins[p].name
            }))
        }),
        buildMenuItem({
            type: 'separator'
        }),
        buildMenuItem({
            label: 'Settings',
            click() {
                openSettingsWindow()
            }
        }),
        buildMenuItem({
            type: 'separator'
        }),
        buildMenuItem({
            label: 'Open',
            click() {
                showWindow();
            }
        }),
        buildMenuItem({
            label: 'Quit',
            role: 'quit'
        })
    ];
    const contextMenu = Menu.buildFromTemplate(template);
    tray.setToolTip('DO');
    tray.setContextMenu(contextMenu);
}

module.exports = {loadTrayMenu};