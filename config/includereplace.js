module.exports = {
  options: {
    globals: {
      VERSION: '<%= pkg.version %>',
      CSS_SRC: '<%= sass.dest %>'
    }
  },
  html: {
    src: 'res/tmpl/index.html',
    dest: 'dist/index.html'
  }
}
