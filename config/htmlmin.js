module.exports = {
  html: {
    options: {
      removeComments: true,
      collapseWhitespace: true,
      ignoreCustomComments: [
        /\s+ko[^"-->"]+/,
        /\s+\/ko\s+/,
        /\sBUILD[:A-Za-z]+\s/
      ]
    },
    src: '<%= includereplace.html.dest %>',
    dest: '<%= includereplace.html.dest %>'
  }
}
