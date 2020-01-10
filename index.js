#!/usr/bin/env node
var path = require('path')
var grunt = require('grunt')
var pkg = require('./package.json')
var ci = require('./ci')

// Get the tasks passed in to the command
var TasksArgs = process.argv.slice(2).filter(function (task) {
  return /^[a-zA-Z:-_.]+$/.test(task)
})

// Get the options passed in to the command
var TasksOpts = {}
process.argv.slice(2).forEach(function (opt, index, opts) {
  if (opt.slice(0, 2) === '--') {
    var option = opt.slice(2).split('=')
    var key = option[0]
    var val = option.length > 1 ? option[1] : true

    // If a custom bump type is set, update the task list
    if (key === 'bumpType' && ['patch', 'minor', 'major'].indexOf(val) > -1) {
      var tskIdx = TasksArgs.indexOf('bump')
      if (tskIdx > -1) {
        TasksArgs.splice(tskIdx, 1, 'bump:' + val)
      }

      tskIdx = TasksArgs.indexOf('publish')
      if (tskIdx > -1) {
        TasksArgs.splice(tskIdx, 1, 'bump:' + val, 'buildprod')
      }

      // Dedupe the task list, removing all but the first instances
      TasksArgs.forEach(function(task, idx, arr) {
        if (arr.indexOf(task) !== idx) {
          arr.splice(idx, 1)
        }
      })

      return
    }

    TasksOpts[key] = val
  }
})

// Create a reference for here
var BuildDir = path.resolve(__dirname)

// Store the cwd
var cwd = process.cwd()

// Load all the required grunt task plugins. Requires first changing to here
// and then changing back after the tasks are run. Since grunt doesn't report
// when it can't load something, "spy" on its error
var err = grunt.log.error
var missing = []
grunt.log.error = function (msg) {
  var match = /Local Npm module "([a-zA-Z0-9-_@/]+)" not found/.exec(msg)
  if (match) {
    missing.push(match[1])
  } else {
    err(msg)
  }
}

grunt.loadNpmTasks(pkg.name)
process.chdir(BuildDir)
missing.forEach(grunt.loadNpmTasks)
grunt.loadTasks(path.join(BuildDir, 'tasks'))
process.chdir(cwd)
grunt.log.error = err

// Helper to load configs/tasks
var reqConfig = function (task) {
  return require(path.resolve(BuildDir, 'config', task))
}
var reqTask = function (task) {
  return require(path.resolve(BuildDir, 'tasks', task))
}

var projPkg = grunt.file.readJSON('package.json')
grunt.initConfig({
  ci: ci,
  pkg: projPkg,
  bump: reqConfig('bump'),
  clean: reqConfig('clean'),
  copy: reqConfig('copy'),
  copyExtras: reqConfig('copyExtras'),
  htmlmin: reqConfig('htmlmin'),
  htmlChecker: reqConfig('html-checker'),
  includereplace: reqConfig('includereplace'),
  postcss: reqConfig('postcss'),
  sass: reqConfig('sass'),
  uglify: reqConfig('uglify'),
  war: reqConfig('war'),
  watch: reqConfig('watch')
})

// SPECIFY TASKS TO RUN

// Tasks to compile the project
// noop task to run if there are no extra files to copy
grunt.registerTask('css', ['sass', 'postcss'])
grunt.registerTask('compile', ['clean', 'htmlChecker', 'css', 'assets'])
grunt.registerTask('noop', function () {})
grunt.registerTask('build', [
  'compile',
  'copy:dev',
  (Array.isArray(projPkg.buildCopy) ? 'copyExtras' : 'noop'),
  'manifest',
  'war:dev'
])
grunt.registerTask('buildprod', [
  'compile',
  'copy:prod',
  (Array.isArray(projPkg.buildCopy) ? 'copyExtras' : 'noop'),
  'manifest',
  'war:prod'
])

// Tasks to Deploy the project
grunt.registerTask('publish', ['bump', 'buildprod'])
grunt.registerTask('deploy', ['build', 'copy:war'])

// Development task to create a watch
grunt.registerTask('watchFiles', [
  'htmlChecker',
  'css',
  'assets',
  'copy:dev',
  'copyExtras',
  'war:dev'
])
grunt.registerTask('dowatch', ['build', 'copy:war', 'watch:local'])
grunt.registerTask('dowatch:scp', ['build', 'scp', 'watch:scp'])

// Default task(s).
grunt.registerTask('default', ['build'])

// Finally run the tasks, with options and a callback when we're done
grunt.file.setBase(cwd)
grunt.tasks(TasksArgs, Object.assign({
  gruntfile: false
}, TasksOpts), function () {
  grunt.log.ok('All build tasks done.')
})
