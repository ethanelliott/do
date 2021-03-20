const {BaseCommand} = require('../base-command');
const mediaController = require('node-media-controller');

class MediaControls extends BaseCommand {
    constructor() {
        super();
        this.name = 'Media Controls';
        this.description = 'Play, Pause, and skip tracks with a command';
        this.command = 's';
    }

    handler(c) {
        super.handler(c);
        const tokens = c.split(' ');
        if (mediaController.getCommands().includes(tokens[1])) {
            mediaController.executeCommand(tokens[1], (err) => {
                if (err) {
                    console.error(err);
                }
            })
        }
    }
}

module.exports = {command: MediaControls};
