var httpProxy = require('http-proxy')
var express = require('express')
var $url = require('url')
var proxy = httpProxy.createProxyServer({})
proxy.on('error', function(e){
  console.error('proxy error', e)
})

module.exports = function n0gx(conf){
  var app = express()

  Object.keys(conf).forEach(function(key){
    var type = conf[key][0]
    var target = conf[key][1]
    var handler = createHandler(type, target)

    if (key === '4xx') {
      return app.use('/', function(err, req, res, next){
        if (err.status && err.status < 500) {
          handler(req, res, next)
        } else next(err)
      })
    }
    if (key === '5xx') {
      return app.use('/', function(err, req, res, next){
        if (!err.status || err.status >= 500) {
          handler(req, res, next)
        } else next(err)
      })
    }
    app.use(key, handler)
  })

  return app
}

function createHandler(type, target){
  if (type === 'static') {
    return express.static(target)
  }
  if (type === 'proxy') {
    return function(req, res){
      proxy.web(req, res, { target: target })
    }
  }
  if (type === 'redirect') {
    return function(req, res){
      res.redirect($url.resolve(req.url, target))
    }
  }
}
