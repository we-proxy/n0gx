# n0gx

> No Nginx, Node Only

## Features

- Static
- Dispatch
- Redirect
- Redirect-way 404/500

## Todo

- [ ] Test
- [ ] Log
- [ ] Dispatch-way 404/500
- [ ] More from nginx...

## Usage

Boot from any conf file under shell:

```
$ npm i -g n0gx  ## install
$ n0gx path/to/my/n0gx.conf  ## .json or .js
```

```js
// example/n0gx.conf.json
{
  "static": {
    "/static": "./example/static"
  },

  "dispatch": {
    "/voice1min": "http://fritx.me/voice1min",
    "/blog_local": "http://127.0.0.1:8080/blog"
  },

  "redirect": {
    "/blog": "http://fritx.me/blog"
  },

  "404": "/blog",
  "500": "/blog",

  "listen": 8111
}
```
