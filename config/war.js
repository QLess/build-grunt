module.exports = {
  options: {
    war_dist_folder: 'dist'
  },

  dev: {
    options: {
      war_name: '<%= pkg.name %>-<%= pkg.version %>-BUILD<%= ci.warNameSuffix %>'
    },
    files: [
      {
        expand: true,
        cwd: 'dist',
        src: ['**'],
        dest: ''
      }
    ]
  },

  prod: {
    options: {
      war_name: '<%= pkg.name %>-<%= pkg.version %>'
    },
    files: [
      {
        expand: true,
        cwd: 'dist',
        src: ['**'],
        dest: ''
      }
    ]
  }
}
