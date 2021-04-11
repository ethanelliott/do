# DO

Welcome to Do, with a fully extensible api for custom plugins, it's the
easiest global shortcut to help you do more by doing less.

## Help Center

This is the help center, the man pages for your plugins. The list on the left
contains all the currently available plugins. Click on each to dive deeper.


## About

This app was built by [Ethan](https://github.com/ethanelliott) to help solve the
issue of not having a simple way to launch things with a customizable and extensible
api. 


### How does it work

The app is written in electron and makes use of a "microservice architecture" for the plugins.
Each plugin is responsible for registering itself with the app, and then when the keyword
is detected in the command, it will forward the whole command to the plugin to handle however
it would like to. This gives full control to the plugin designer to establish their command
formatting.

The app starts running a socket-io instance on a random port, and then broadcasts itself over
mDNS using bonjour. Any service can be listening for this broadcast and then connect to the app
and register itself. This also means that the plugins are language agnostic, as long as they
can connect over a socket-io instance. On top of that, each plugin has the ability to also be a
running application. 

### Adding your own plugin

Check out the [sample plugin](https://github.com/ethanelliott/do-plugin-sample) which is written
in js but shows the bare minimum code required to have a running plugin.
