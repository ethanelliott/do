const {EventEmitter} = require('events');
const glob = require('glob');
const {BaseCommand} = require("./base-command");
const {pathFromRoot} = require("../util");
const bonjour = require('bonjour')();
const {SocketServer} = require("../socket-server");

class Plugins extends EventEmitter {
    plugins = new Map();
    pluginSocketMap = new Map();

    constructor() {
        super();
        this.socket = new SocketServer();
        this.loadPlugins();
        this.discoverLocalPlugins();
    }

    loadPlugins() {
        const pluginPaths = glob.sync(`${pathFromRoot('')}/plugins/**/index.js`);
        pluginPaths.forEach(pluginFile => {
            try {
                const {command} = require(pluginFile);
                const x = new command();
                this.registerPlugin(x);
            } catch (e) {
                console.error(`Unable to load plugin: `, e);
            }
        });
    }

    registerPlugin(plugin) {
        console.log(`Register plugin:`, plugin.name);
        if (!this.plugins.has(plugin.command)) {
            this.plugins.set(plugin.command, plugin);
            this.emit('update');
        } else {
            throw new Error(`Cannot register plugin '${plugin.name}' with prefix: '${plugin.command}', it already exists!`);
        }
    }

    unregisterPlugin(plugin) {
        console.log(`Unregister plugin:`, plugin.name);
        if (!this.plugins.has(plugin.command)) {
            throw new Error(`Cannot unregister plugin '${plugin.name}' with prefix: '${plugin.command}', it doesn't exist!`);
        } else {
            this.plugins.delete(plugin.command);
            this.emit('update');
        }
    }

    getAll() {
        return this.plugins;
    }

    serialize() {
        return Array.from(this.plugins.values()).map(e => ({
            name: e.name,
            description: e.description,
            command: e.command,
            docs: e.docs
        }));
    }

    has(pluginCommand) {
        return this.plugins.has(pluginCommand);
    }

    handle(command, commandString) {
        if (this.has(command)) {
            return this.plugins.get(command).handler(commandString);
        }
        throw new Error('Unknown plugin!');
    }

    settings(plugin) {
        if (this.has(plugin)) {
            return this.plugins.get(plugin).settings();
        }
        throw new Error('Unknown plugin!');
    }

    service;

    discoverLocalPlugins() {
        this.socket.start().then((port) => {
            this.service = bonjour.publish({
                name: 'DO:PLUGINS',
                type: 'http',
                port: port
            });
            console.log(`[mDNS] broadcasting...`);
        });

        this.socket.onNewConnection((socketId) => {
            this.socket.emit(socketId, 'register');
            this.socket.on(socketId, 'register', (data) => {
                const serviceDefinition =  Object.assign({}, data);
                const plugin = Object.assign(new BaseCommand(), serviceDefinition); // to be replaced with builder
                plugin.handler = (command) => {
                    console.log('HANDLE:', command);
                    this.socket.emit(socketId, 'command', command);
                };
                plugin.settings = () => {
                    this.socket.emit(socketId, 'settings');
                };
                this.registerPlugin(plugin);
                this.pluginSocketMap.set(socketId, plugin.command);
            });
        });

        this.socket.onDisconnect((socketId) => {
            const pluginCommand = this.pluginSocketMap.get(socketId);
            this.unregisterPlugin(this.plugins.get(pluginCommand));
        });
    }
}

module.exports = {Plugins}
