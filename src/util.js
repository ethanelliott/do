const {screen} = require('electron');

function openWindowOnCursorScreen(w) {
    const point = screen.getCursorScreenPoint();
    const {bounds} = screen.getDisplayNearestPoint(point);
    const [width, height] = w.getSize();
    w.setPosition(bounds.x + (bounds.width / 2) - (width / 2),
        bounds.y + (bounds.height / 2) - (height / 2),);
    w.show();
}

module.exports = {
    openWindowOnCursorScreen
}
