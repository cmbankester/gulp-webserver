var child_process = require('child_process'),
    default_opts = {
      file: 'index.js',
      args: []
    };


module.exports = (function () {
  var service     = undefined,
      server_file = undefined,
      args        = undefined;

  return {
    run: function (opts) {
      args = opts.args || default_opts.args;
      args.push(opts.file || default_opts.file);

      if (service) { // Stop
        service.kill('SIGKILL');
        service = undefined;
      }

      service = child_process.spawn('node', args);
      service.stdout.setEncoding('utf8');
      service.stdout.pipe(process.stdout);
      service.stderr.setEncoding('utf8');
      service.stderr.pipe(process.stdout);

      service.stdout.on('data', function (data) {
        console.log(data.trim());
      });
      service.stderr.on('data', function (data) {
        console.log(data.trim());
      });
      process.on('exit', function (code, sig) {
        service.kill();
      });

      return service;
    },
    stop: function () {
      if (service) {
        service.kill('SIGKILL');
        service = undefined;
      }
    }
  };
})();
