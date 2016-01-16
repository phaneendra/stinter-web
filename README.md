Stinter Web App
======
Web Application for Stinter

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/phaneendra/stinter-web.svg)](http://isitmaintained.com/project/phaneendra/stinter-web "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/phaneendra/stinter-web.svg)](http://isitmaintained.com/project/phaneendra/stinter-web "Percentage of issues still open")

----

## Features/Roadmap

* Universal App

## Usage

### Requirements
There are some things required before you get started:

* Node.js >= 4.1.1
* npm >= 3
* Git

If your computer already has the requirements above, congratulations!.
If you are using npm 2, note that you may need to add additional dependencies yourself.

#### Install Git

Windows: Download & install msysgit.
Mac: Install it with Homebrew, MacPorts or installer.
Linux (Ubuntu, Debian): sudo apt-get install git-core
Linux (Fedora, Red Hat, CentOS): sudo yum install git-core


#### Install Node.js

The best way to install Node.js is installing with nvm.

cURL:
```
$ curl https://raw.github.com/creationix/nvm/master/install.sh | sh
```

Wget:
```
$ wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | sh
```

Once installed, restart the terminal and run the following command to install Node.js.
```
$ nvm install 0.10
```

Or you can download the installer and install it.

Working with node is very easy, a quick reference guide for node can be found [hear](https://github.com/phaneendra/stinter-web/wiki/Working-with-Node)

#### Install
```bash
npm install
```

#### Running Dev Server
```bash
npm run dev
```

The first time it may take a little while to generate the first `webpack-assets.json` and complain with a few dozen `[webpack-isomorphic-tools] (waiting for the first Webpack build to finish)` printouts, but be patient. Give it 30 seconds.

#### Using Redux DevTools

[Redux Devtools](https://github.com/gaearon/redux-devtools) are enabled by default in development.

- <kbd>H</kbd> Toggle DevTools Dock
- <kbd>Q</kbd> Move DevTools Dock Position
- see [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor) for more detailed information.

If you have the
[Redux DevTools chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) installed it will automatically be used on the client-side instead.

If you want to disable the dev tools during development, set `__DEVTOOLS__` to `false` in `/webpack/dev.config.js`.
DevTools are not enabled during production.

### Building and Running Production Server

```bash
npm run build
npm run start
```


## Contributors
All contributions are welcome! The simplest way to show your support for this project is to **"star" it**. Please see [Contributing to stinter-web](https://github.com/phaneendra/stinter-web/blob/master/CONTRIBUTING.md) for more information.

### Contributors on GitHub
* [Contributors](https://github.com/phaneendra/stinter-web/graphs/contributors)

### Third party libraries
* see [LIBRARIES](https://github.com/phaneendra/stinter-web/wiki/LIBRARIES) files

## License
* see [LICENSE](https://github.com/phaneendra/stinter-web/blob/master/LICENSE.md) file

## Version
* Version 0.0.1

## Contact
####  - Phaneendra
* Homepage:
* Twitter: [@phaneekr](https://twitter.com/phaneekr "phaneekr on twitter")
* Slack:
