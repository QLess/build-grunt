module.exports = function (grunt) {
  grunt.registerTask("manifest", "Create a detailed version manifest", function () {
    var manifest = {
      "id": grunt.config("pkg.name"),
      "version": grunt.config("pkg.version"),
      "build": grunt.config("ci.buildNumber"),
      "commit": grunt.config("ci.buildCommit"),
      "date": grunt.template.today("isoDateTime")
    }

    grunt.file.write('dist/version.json', JSON.stringify(manifest, "", 2))
  })
}