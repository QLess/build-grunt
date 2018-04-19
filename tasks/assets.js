// Returns a function that accepts the grunt object as the only arg
module.exports = function (grunt) {
  // This is the actual grunt task that gets run
  grunt.registerMultiTask('assets', function () {
    var version = grunt.template.process('<%= pkg.version %>')
    var options = this.options()

    this.files.forEach(function (f) {
      var src = f.src
      .filter(function(src) {
        if (!grunt.file.exists(src) || grunt.file.isDir(src)) {
          grunt.log.warn('Source file "' + src + '" not found.')
          return false
        }
        return true
      })
      .map(function(filepath) {
        return grunt.file.read(filepath);
      })
      .join('\n')
      .replace(
        /<!-- BUILD:START:(CSS|JS):([A-Za-z]+) -->([\s\S]+?)<!-- BUILD:END -->/g,
        function (match, type, name, srcs) {
          type = type.toLowerCase()

          var reg = /<script src="([a-zA-Z0-9-._/]+)"><\/script>/g
          if (type === 'css') {
            reg = /<link rel="stylesheet" href="([a-zA-Z0-9-._/]+)">/g
          }
          reg = new RegExp(reg)

          var src = []
          while ((match = reg.exec(srcs)) !== null) {
            src.push(match[1])
          }

          var output = [
            'res',
            type,
            name + '.' + version + '.min.' + type
          ].join('/')


          // Create config
          var destDir = options.prefix ? options.prefix + '/' : ''
          var config = {}
          config[name] = {
            src: src,
            dest: 'dist/' + destDir + output
          }

          if (type === 'css') {
            grunt.config.merge({postcss: config})
            grunt.task.run(['postcss:' + name])

            return '<link rel="stylesheet" href="' + output + '">'
          }

          if (name === 'lib') {
            config[name].options = {
              compress: false,
              mangle: false
            }
          }

          grunt.config.merge({uglify: config})
          grunt.task.run(['uglify:' + name])

          // Return the replacement for this block
          return '<script src="' + output + '"></script>'
        }
      )

      if (src.length < 1) {
        return
      }

      grunt.file.write(f.dest, src)

      grunt.log.ok('Updated new JS references in ' + f.dest)
    })
  })
}
