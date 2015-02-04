# n0gx

> No Nginx, Node Only

## Features

- Static
- Proxy
- Redirect
- Sendfile
- 404/4xx/5xx

## Todo

- [ ] Test
- [ ] Log
- [ ] Hostname
- [ ] More from nginx...

## Usage

Boot from any conf file under shell:

```
$ npm i -g n0gx  ## install
$ n0gx n0gx-conf 8111  ## json/js file, port
```

```js
// example/n0gx-conf.js
module.exports = {
  '/': ['static', './example/static'],
  '/wxtopic/': ['proxy', 'http://localhost:9113'],
  '/blog/': ['proxy', 'http://localhost:8080/blog'],
  '/blog_online/': ['redirect', 'http://fritx.me/blog'],

  '*': ['sendfile', './example/static/404.html'],
  '4xx': ['sendfile', './example/static/4xx.html'],
  '5xx': ['sendfile', './example/static/5xx.html']
}
```

```js
// or as a node module
var n0gx = require('n0gx')
var app = n0gx(conf)
app.listen(8111, function(e){/**/})
```
