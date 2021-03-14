const {BaseCommand} = require('../base-command');
const {Storage} = require('../local-storage');
const open = require('open');

class Go extends BaseCommand {
    constructor() {
        super();
        this.name = 'Go';
        this.description = 'go places and do things';
        this.prefix = 'go';
        this.db = Storage.getInstance(['m']);
    }

    handler(c) {
        super.handler(c);
        const places = this.getMappings();
        const tokens = c.split(' ');
        if (tokens.length > 1) {
            const place = places.find(p => p.name === tokens[1]);
            open(place.url);
        } else {
            throw new Error('Invalid command!');
        }
    }

    getMappings() {
        return this.db.findAll('m');
    }
}

module.exports = {command: Go};
