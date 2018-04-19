module.exports = {
  main: {
    src: 'res/tmpl/index.html',
    dest: 'dist/index.html'
  },
  login: {
    options: {
      destDir: 'login'
    },
    src: 'login/index.html',
    dest: 'dist/login/index.html'
  },
  logout: {
    options: {
      destDir: 'logout'
    },
    src: 'logout/index.html',
    dest: 'dist/logout/index.html'
  }
}
