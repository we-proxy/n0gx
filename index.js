var httpProxy = require('http-proxy')
var express = require('express')

module.exports = function n0gx(conf, cb){
  var app = express()
  var proxy = httpProxy.createProxyServer({})
  proxy.on('error', function(e){
    console.error('proxy error', e)
  })

  Object.keys(conf['static']).forEach(function(key){
    app.get(key, fixGetPrefix(key))
    app.use(key, express.static(conf['static'][key]))
  })

  Object.keys(conf['dispatch']).forEach(function(key){
    app.get(key, fixGetPrefix(key))
    app.use(key, function(req, res){
      proxy.web(req, res, { target: conf['dispatch'][key] })
    })
  })

  Object.keys(conf['redirect']).forEach(function(key){
    app.use(key, function(req, res){
      res.redirect(conf['redirect'][key])
    })
  })

  if (conf['404']) {
    app.get('*', function(req, res){
      res.redirect(conf['404'])
    })
  }

  return app.listen(conf['listen'], cb)
}


function fixGetPrefix(prefix){
  var _prefix = prefix.replace(/\/$/, '')
  return function(req, res, next){
    if (req._parsedUrl.pathname === _prefix) {
      return res.redirect(_prefix + '/')
    }
    next()
  }
}
