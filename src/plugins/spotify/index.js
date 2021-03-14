const {BaseCommand} = require('../base-command');
const mediaController = require('node-media-controller');

class Spotify extends BaseCommand {
    constructor() {
        super();
        this.name = 'Spotify Control';
        this.description = 'Play, Pause, and skip tracks with a command';
        this.prefix = 's';
    }

    handler(c) {
        super.handler(c);
        const tokens = c.split(' ');
        console.log(tokens);
        if (mediaController.getCommands().includes(tokens[1])) {
            mediaController.executeCommand(tokens[1], (err) => {
                if (err) {
                    console.error(err);
                }
            })
        }
    }
}

module.exports = {command: Spotify};
