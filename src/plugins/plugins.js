const glob = require('glob');
const {pathFromRoot} = require("../util");

class Plugins {
    plugins = {}

    constructor() {
        this.loadPlugins();
    }

    loadPlugins() {
        const pluginPaths = glob.sync(`${pathFromRoot('')}/plugins/**/index.js`);
        pluginPaths.forEach(pluginFile => {
            try {
                const {command} = require(pluginFile);
                const x = new command();
                console.log(`Loading plugin:`, x.name);
                if (!this.plugins.hasOwnProperty(x.prefix)) {
                    this.plugins[x.prefix] = x;
                } else {
                    throw new Error(`Cannot register plugin '${x.name}' with prefix: '${x.prefix}', it already exists!`);
                }
            } catch (e) {
                console.error(`Unable to load plugin: `, e);
            }
        });
    }

    getAll() {
        return this.plugins;
    }

    has(pluginCommand) {
        return this.plugins.hasOwnProperty(pluginCommand);
    }

    handle(pluginPrefix, commandString) {
        if (this.has(pluginPrefix)) {
            return this.plugins[pluginPrefix].handler(commandString);
        }
        throw new Error('Unknown plugin!');
    }
}

module.exports = {Plugins}
