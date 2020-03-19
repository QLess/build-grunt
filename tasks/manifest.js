module.exports = function (grunt) {
  grunt.registerTask("manifest", "Create a detailed version manifest", function () {
    var version = {
      "id": grunt.config("pkg.name"),
      "version": grunt.config("pkg.version"),
      "build": grunt.config("ci.buildNumber"),
      "commit": grunt.config("ci.buildCommit"),
      "date": grunt.template.today("isoDateTime")
    }

    grunt.file.write('dist/version.json', JSON.stringify(version, "", 2))

    var manifest = {
      "id": grunt.config("pkg.name"),
      "Major-Version": grunt.config("pkg.version"),
      "Build-Branch": grunt.config("ci.buildBranch"),
      "Built-By": grunt.config("ci.username"),
      "Build-Name": grunt.config("pkg.name") + "-" + grunt.config("pkg.version") + ".war",
      "Build-Time": grunt.template.today("isoDateTime"),
      "Built-User": grunt.config("ci.username"),
      "Commit-Id": grunt.config("ci.buildCommit")
    }

    grunt.file.write('dist/META-INF/manifest.json', JSON.stringify(manifest, "", 2))

  })
}