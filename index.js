var child_process = require('child_process');

module.exports = (function () {
  var service;
  var restarting;

  // Intercept ctrl+c and pass it to the service instead of letting it kill
  // process. That way, any cleanup that the service needs to perform can
  // log to stdout if necessary (process won't die until after service tells
  // it that it's dying)
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.on('data', function(char) {
    if (char == '\3') {
      service.kill('SIGINT');
      service = undefined;
    }
  });

  process.on('exit', function (){
    if (service) {
      service.kill();
    }
  });

  return {
    run: function (opts) {
      var node_args = opts.args || [];

      node_args.push(opts.file || 'index.js');

      if (service) {
        restarting = true;
        service.kill('SIGINT');
        service = undefined;
      }

      service = child_process.spawn('node', node_args);
      service.stdout.setEncoding('utf8');
      service.stdout.pipe(process.stdout);
      service.stderr.setEncoding('utf8');
      service.stderr.pipe(process.stderr);

      service.on('exit', function(){
        if (restarting) {
          restarting = undefined;
        } else {
          process.exit(0);
        }
      });

      return service;
    },
    stop: function () {
      if (service) {
        service.kill('SIGINT');
        service = undefined;
      }
    }
  };
})();
