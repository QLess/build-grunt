// Returns a function that accepts the grunt object as the only arg
module.exports = function (grunt) {
  // This is the actual grunt task that gets run
  grunt.registerTask('scp', function () {
    var done = this.async()
    var exec = require('child_process').exec
    var verbose = grunt.option('verbose')

    var command = ['scp', '-p']

    if (verbose) {
      command.push('-v')
    }

    // files to copy
    command.push('dist/*.war')

    command.push('vagrantvm:/usr/local/jboss/server/default/deploy')
    command = command.join(' ')

    grunt.verbose.writeln('SCP: ' + command)

    exec(command, function (err, stdout, stderr) {
      if (stdout) {
        grunt.log.writeln(stdout)
      }
      if (stderr) {
        grunt.log.writeln(stderr)
      }

      if (err) {
        grunt.fail.fatal(err)
        done(false)
      } else {
        grunt.log.ok()
        done(true)
      }
    })
  })
}
