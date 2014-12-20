# Gulp plugin to run a webserver

A simple script to handle starting/restarting a node webserver.

Based heavily off of the development by [gimm](https://github.com/gimm) on
[gulp-express](https://github.com/gimm/gulp-express)

## Install

```bash
$ npm install --save-dev gulp-webserver
```

## Usage

`Gulpfile.js`:
```js
var main_file = require('./package.json').main;
var gulp = require('gulp');
var server = require('gulp-webserver');

gulp.task('prepare-server', function(cb){
  // Server preparation stuff like asset compilation/copying
  ...
  cb()
});

gulp.task('server', function () {
    // Starts/restarts the server
    server.run({
        file: main_file
    });
});

gulp.task('default', ['prepare-server', 'server'], function(){
  // Restart the server when file changes
  gulp.watch(['some', 'files'], ['prepare-server']);
  gulp.watch(['app/**/*.js'], ['server']);
});
```

`path/to/main/file.js`
```js
// e.g. express/hapi/koa/etc.
var server    = require('some/web/server.js');

// set up your server (routes, process-setup, etc.)
...

// start your server
server.start();

// export the server if you need access to it elsewhere
module.exports = server;
```

## API

### server.run([options])
Starts / restarts the server

Returns a [ChildProcess](http://nodejs.org/api/child_process.html#child_process_class_childprocess) instance of spawned server.

#### options
Type: `Object`

Options to pass to gulp-webserver:
* `file` Application entry point file. Default: `'index.js'`.
* `args` Arguments array to pass to `node` process. For example: `['--debug']`.
Default: `[]`

### server.stop()
Just calls `server.kill()` (See [ChildProcess#kill](http://nodejs.org/api/child_process.html#child_process_child_kill_signal))
