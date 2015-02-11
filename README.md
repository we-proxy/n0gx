# n0gx

> No Nginx, Node Only

## Features

- Static
- Proxy
- Redirect
- Sendfile
- Status Only
- 404/4xx/5xx
- Slash Safe
- Hostnames

## Todo

- [ ] Test
- [ ] Log
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
  'localhost': {
    '/wxtopic/': ['proxy', 'http://localhost:9113'],
    '/blog/': ['proxy', 'http://localhost:8080/blog'],
    '/blog_online/': ['redirect', 'http://fritx.me/blog'],
    '/': ['static', './example/static']
  },

  '*': ['sendfile', './example/static/404.html'],
  '4xx': ['status', 400],
  '5xx': ['status', 500]
}
```

```js
// or as a node module
var n0gx = require('n0gx')
var app = n0gx(conf)
app.listen(8111, function(e){/**/})
```
