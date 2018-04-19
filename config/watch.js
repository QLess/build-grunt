module.exports = {
  local: {
    files: ['res/**/*'],
    tasks: ['watchFiles', 'copy:war']
  },
  scp: {
    files: ['res/**/*'],
    tasks: ['watchFiles', 'scp']
  }
}
