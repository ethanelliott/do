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
    if(!tray) {
        tray = new Tray(getIcon());
        tray.setToolTip('DO');
        tray.on('click', () => {
            showWindow();
        })
    }
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
            submenu: Array.from(plugins.values()).map(e => ({
                label: e.name
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
    tray.setContextMenu(Menu.buildFromTemplate(template));

}

module.exports = {loadTrayMenu};
