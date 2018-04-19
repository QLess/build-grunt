module.exports = {
  extra: {
    files: [{
      expand: true,
      dot: true,
      cwd: '',
      src: '<%= pkg.buildCopy %>'
    }]
  }
}
