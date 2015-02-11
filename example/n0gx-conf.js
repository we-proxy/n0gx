module.exports = {
  'localhost': {
    '/wxtopic/': ['proxy', 'http://localhost:9113'],
    '/blog/': ['proxy', 'http://localhost:8080/blog'],
    '/blog_online/': ['concat', 'http://fritx.me/blog'],
    '/': ['static', './example/static']
  },

  '*': ['sendfile', './example/static/404.html'],
  '4xx': ['status', 400],
  '5xx': ['status', 500]
}
