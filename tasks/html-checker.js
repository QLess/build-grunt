// Returns a function that accepts the grunt object as the only arg
module.exports = function (grunt) {
  // This is the actual grunt task that gets run
  grunt.registerMultiTask('htmlChecker', function () {
    var name = this.target
    var options = this.options()
    var tasks = []

    this.files.forEach(function(f) {
      var src = f.src.filter(function(src) {
        if (!grunt.file.exists(src) || grunt.file.isDir(src)) {
          grunt.verbose.warn('Source file "' + src + '" not found.')
          return false
        }
        return true
      })

      if (src.length < 1) {
        return
      }

      // Create config
      var config = {}
      config[name] = {
        src: src,
        dest: f.dest
      }

      // Config for the includeReplace task
      grunt.config.merge({includereplace: config})

      // Config for the htmlmin task
      config[name].src = f.dest
      grunt.config.merge({htmlmin: config})

      // Config for the assets custom task
      if (options.destDir) {
        config[name].options = {
          prefix: options.destDir.replace(/\/$/, '')
        }
      }
      grunt.config.merge({assets: config})

      // Schedule the tasks to run
      tasks.push(
        'includereplace:' + name,
        'htmlmin:' + name,
      )
    })

    if (tasks.length > 0) {
      grunt.task.run(tasks)
      grunt.log.ok('IncludeReplace and HTMLMin tasks scheduled for ' + name)
    } else {
      grunt.log.ok('Did not find source files. Skipping ' + name)
    }
  })
}
