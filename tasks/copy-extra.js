// Returns a function that accepts the grunt object as the only arg
module.exports = function (grunt) {
  // This is the actual grunt task that gets run
  grunt.registerMultiTask('copyExtras', function () {
    var name = this.target

    var files = this.filesSrc.filter(function(src) {
      if (
        !grunt.file.exists(src) ||
        grunt.file.exists('dist', src)
      ) {
        return false
      }
      return true
    })

    if (files.length < 1) {
      grunt.log.ok('No extra files to copy')
      return
    }

    // Create config
    grunt.config.set('copy.extras', {
      files: [{
        expand: true,
        cwd: '',
        src: files,
        dest: 'dist'
      }]
    })

    grunt.task.run('copy:extras')
    grunt.log.ok('copy:extra schedule')
  })
}
