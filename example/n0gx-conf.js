module.exports = {
  '/': ['static', './example/static'],
  '/wxtopic/': ['proxy', 'http://localhost:9113'],
  '/blog/': ['proxy', 'http://localhost:8080/blog'],
  '/blog_online/': ['redirect', 'http://fritx.me/blog'],

  '*': ['sendfile', './example/static/404.html'],
  '4xx': ['sendfile', './example/static/4xx.html'],
  '5xx': ['sendfile', './example/static/5xx.html']
}
