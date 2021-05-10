const {BaseCommand} = require('../base-command');
const mediaController = require('node-media-controller');
const fs = require("fs");
const path = require("path");

class MediaControls extends BaseCommand {
    constructor() {
        super();
        this.name = 'Media Controls';
        this.description = 'Play, Pause, and skip tracks with a command';
        this.command = 'm';
        this.docs = fs.readFileSync(path.resolve('./src/plugins/media-controls/docs.md'), 'utf-8');
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

    settings() {
        console.log(this.name, 'settings');
    }
}

module.exports = {command: MediaControls};
