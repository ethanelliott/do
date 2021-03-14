const DB = require('diskdb');
const path = require('path');
const fs = require('fs');

class Storage {
    static DB_PATH = path.resolve(process.cwd(), 'db')

    static #instance = null;

    static getInstance(tables) {
        if (this.#instance === null) {
            this.#instance = new Storage();
        }
        this.#instance.addTables(tables);
        this.#instance.reconnect();

        return this.#instance;
    }

    constructor() {
    }

    tables = [];

    addTables(tables) {
        this.tables.push(...tables);
    }

    reconnect() {
        fs.mkdirSync(Storage.DB_PATH, {recursive: true});
        this.database = DB.connect(Storage.DB_PATH, this.tables);
    }

    findAll(tableName) {
        return this.getTable(tableName).find();
    }

    find(tableName, query) {
        return query ? this.getTable(tableName).find(query) : this.getTable(tableName).find();
    }

    findOne(tableName, query) {
        return query ? this.getTable(tableName).findOne(query) : this.getTable(tableName).findOne();
    }

    save(tableName, values) {
        return this.getTable(tableName).save(values);
    }

    update(tableName, query, values) {
        return this.getTable(tableName).update(query, values)
    }

    remove(tableName, query) {
        if (query) {
            return this.getTable(tableName).remove(query);
        }
        throw new Error('Must include query... to delete table, use .deleteTable()');
    }

    count(tableName) {
        return this.getTable(tableName).count();
    }

    deleteTable(tableName) {
        return this.getTable(tableName).remove();
    }

    getTable(tableName) {
        if (this.tables.includes(tableName)) {
            return this.database[tableName];
        }
        throw new Error('Table does not exist...');
    }
}

module.exports = {Storage};
