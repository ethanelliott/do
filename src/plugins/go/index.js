const {BaseCommand} = require('../base-command');
const {Storage} = require('../local-storage');
const open = require('open');
const fs = require("fs");
const path = require("path");

const tableName = 'go-mappings';

class Go extends BaseCommand {
    constructor() {
        super();
        this.name = 'Go';
        this.description = 'go places and do things';
        this.command = 'go';
        this.docs = fs.readFileSync(path.resolve('./src/plugins/go/docs.md'), 'utf-8');
        this.db = Storage.getInstance([tableName]);
        if (this.getMappings().length === 0) {
            this.newGo('ethan', 'https://ethanelliott.ca');
        }
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
        return this.db.findAll(tableName);
    }

    newGo(name, url) {
        this.db.save(tableName, {
            name,
            url
        })
    }
}

module.exports = {command: Go};
