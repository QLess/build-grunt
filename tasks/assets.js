// Returns a function that accepts the grunt object as the only arg
module.exports = function (grunt) {
  // This is the actual grunt task that gets run
  return function () {
    var src = grunt.template.process('<%= htmlmin.html.dest %>')
    var version = grunt.template.process('<%= pkg.version %>')

    grunt.file.write(
      src,
      grunt.file.read(src).replace(
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
          var config = {}
          config[name] = {
            src: src,
            dest: 'dist/' + output
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
    )

    grunt.log.ok('Updated ' + src + ' with new JS references')
  }
}
