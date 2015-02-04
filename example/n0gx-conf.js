module.exports = {
  '/': ['static', './example/static'],
  '/wxtopic/': ['proxy', 'http://localhost:9113'],
  '/blog/': ['proxy', 'http://localhost:8080/blog'],
  '/blog_online/': ['redirect', 'http://fritx.me/blog'],

  '*': ['redirect', '/'],
  '4xx': ['redirect', '/'],
  '5xx': ['redirect', '/']
}
