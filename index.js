var child_process = require('child_process'),
    default_opts = {
      file: 'index.js',
      args: []
    };


module.exports = (function () {
  var service     = undefined,
      server_file = undefined,
      node_args   = undefined;

  return {
    run: function (opts) {
      node_args = opts.args || default_opts.args;
      node_args.push(opts.file || default_opts.file);

      if (service) { // Stop
        service.kill('SIGINT');
        service = undefined;
      }

      service = child_process.spawn('node', node_args);
      service.stdout.setEncoding('utf8');
      service.stdout.pipe(process.stdout);
      service.stderr.setEncoding('utf8');
      service.stderr.pipe(process.stderr);

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
        } else {
          process.stdout.write(char);
        }
      });

      service.on('exit', function(){
        process.exit(0);
      });

      process.on('exit', function (){
        if (service) {
          service.kill();
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
