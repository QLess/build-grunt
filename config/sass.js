module.exports = {
  options: {
    implementation: require('node-sass'),
    outputStyle: 'compressed',
    sourceMap: true
  },
  dest: 'res/css/style.<%= pkg.version %>.min.css',
  dist: {
    src: ['res/css/sass/style.scss'],
    dest: 'dist/<%= sass.dest %>'
  }
}
