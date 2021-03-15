const {screen} = require('electron');
const path = require('path');
const os = require('os');

const openWindowOnCursorScreen = (w) => {
    const point = screen.getCursorScreenPoint();
    const {bounds} = screen.getDisplayNearestPoint(point);
    const [width, height] = w.getSize();
    w.setPosition(bounds.x + (bounds.width / 2) - (width / 2),
        bounds.y + (bounds.height / 2) - (height / 2),);
    w.show();
}

const pathFromRoot = (p) => {
    return path.resolve(__dirname, p);
}

const configPath = () => {
    return path.resolve(os.homedir(), '.do')
}

const getIcon = () => {
    return pathFromRoot('assets/run.ico');
}

module.exports = {
    openWindowOnCursorScreen,
    getIcon,
    pathFromRoot,
    configPath
}
