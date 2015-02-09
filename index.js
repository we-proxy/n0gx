var httpProxy = require('http-proxy')
var express = require('express')
var _ = require('lodash')
var $url = require('url')
var proxy = httpProxy.createProxyServer({})
proxy.on('error', function(e){
  console.error('proxy error', e)
})

module.exports = function n0gx(conf){
  var app = express()

  var list = []
  _.each(conf, function(val, key){
    if (_.isArray(val)) {
      list.push([key].concat(val))
    } else {
      _.each(val, function(v, k){
        list.push([k].concat(v).concat(key))
      })
    }
  })

  _.each(list, function(val){
    var key = val[0]
    var type = val[1]
    var target = val[2]
    var hostn = val[3]
    var handler = createHandler(type, target)

    if (key === '4xx') {
      return app.use(function(err, req, res, next){
        if (hostn && req.hostname !== hostn) {
          return next(err)
        }
        if (err.status && err.status < 500) {
          handler(req, res, next)
        } else next(err)
      })
    }
    if (key === '5xx') {
      return app.use(function(err, req, res, next){
        if (hostn && req.hostname !== hostn) {
          return next(err)
        }
        if (!err.status || err.status >= 500) {
          handler(req, res, next)
        } else next(err)
      })
    }
    app.use(key, createSlasher(key), function(req, res, next){
      if (hostn && req.hostname !== hostn) {
        return next()
      }
      handler(req, res, next)
    })
  })

  return app
}

function createHandler(type, target){
  if (type === 'static') {
    return express.static(target)
  }
  if (type === 'proxy') {
    return function(req, res){
      forwardReq(req)
      proxy.web(req, res, { target: target })
    }
  }
  if (type === 'redirect') {
    return function(req, res){
      var base = req._parsedUrl.pathname
      res.redirect($url.resolve(base, target))
    }
  }
  if (type === 'sendfile') {
    return function(req, res){
      res.sendFile(target, { root: process.cwd() })
    }
  }
}

function createSlasher(key){
  return function(req, res, next){
    var pathname = req._parsedUrl.pathname
    var search = req._parsedUrl.search || ''
    if (pathname === '/') return next()
    if (key === '/') return next()
    if (key.slice(-1) === '/') {
      if (pathname === key.slice(0, -1)) {
        res.redirect(key + search)
      } else next()
    } else {
      if (pathname === key + '/') {
        res.redirect('..' + key + search)
      } else next()
    }
  }
}

function forwardReq(req){
  lowerKeys(req.headers)
  if (req.headers['x-forwarded-for']) {
    req.headers['x-forwarded-for'] += ', ' + req.ip
  } else {
    req.headers['x-forwarded-for'] = req.ip
  }
}
function lowerKeys(obj){
  _.each(obj, function(val, key, list){
    delete list[key]
    list[key.toLowerCase()] = val
  })
}
