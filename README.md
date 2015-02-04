# n0gx

> No Nginx, Node Only

## Features

- Static
- Proxy
- Redirect
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
{
  '/': ['static', './example/static'],
  '/wxtopic/': ['proxy', 'http://localhost:9113'],
  '/blog/': ['proxy', 'http://localhost:8080/blog'],
  '/blog_online/': ['redirect', 'http://fritx.me/blog'],

  '*': ['redirect', '/'],
  '4xx': ['redirect', '/'],
  '5xx': ['redirect', '/']
}
```

```js
// or as a node module
var n0gx = require('n0gx')
var app = n0gx(conf)
app.listen(8111, function(e){/**/})
```
