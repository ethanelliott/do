class BaseCommand {
    constructor() {
        this.name = '';
        this.description = '';
        this.command = '';
        this.docs = ''
    }

    handler(c) {
        // maybe something with command history here
        console.log('HANDLE:', c);
    }
}

module.exports = {BaseCommand};
