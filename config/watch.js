module.exports = {
  local: {
    files: ['res/**/*.*'],
    tasks: ['html', 'css', 'assets', 'copy:dev', 'war:dev', 'copy:war']
  },
  scp: {
    files: ['res/**/*.*'],
    tasks: ['html', 'css', 'assets', 'copy:dev', 'war:dev', 'scp']
  }
}
