module.exports = {
  options: {
    map: {
      inline: false
    }
  },
  dist: {
    options: {
      map: true,
      processors: [
        require('autoprefixer')({ browsers: 'last 2 versions' })
      ]
    },
    src: '<%= sass.dist.dest %>',
    dest: '<%= sass.dist.dest %>'
  }
}
