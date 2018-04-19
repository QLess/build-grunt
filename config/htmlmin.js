module.exports = {
  options: {
    removeComments: true,
    collapseWhitespace: true,
    ignoreCustomComments: [
      /\s+ko[^"-->"]+/,
      /\s+\/ko\s+/,
      /\sBUILD[:A-Za-z]+\s/
    ]
  }
}
