var httpProxy = require('http-proxy')
var express = require('express')
var _ = require('lodash')
var $url = require('url')
var path = require('path')

var proxy = httpProxy.createProxyServer({
  changeOrigin: true
})
proxy.on('error', function(e){
  console.error('proxy error', e)
})

module.exports = function n0gx(conf, isHttps = false){
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
    var handler = createHandler(type, target, isHttps)

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

function createHandler(type, target, isHttps){
  if (type === 'static') {
    return express.static(target, { dotfiles: 'ignore' })
  }
  if (type === 'proxy') {
    return function(req, res){
      forwardReq(req, isHttps)

      // Keeping old syntax as n0gx has been targeting to old versions of Node.js
      var proxyTarget = target
      var targetObj = $url.parse(target)
      if (targetObj.pathname !== '/') {
        proxyTarget = [targetObj.protocol, '//', targetObj.host].join('')
        // Mutating req.url directly here
        req.url = path.posix.join(req.url, targetObj.pathname)
      }
      proxy.web(req, res, { target: proxyTarget })
    }
  }
  if (type === 'redirect') {
    return function(req, res){
      xRedirect(req, res, target)
    }
  }
  if (type === 'concat') {
    return function(req, res){
      var pathname = req._parsedUrl.pathname
      pathname = pathname.replace(req.baseUrl, '')
      pathname = pathname.replace(/^\//, '')
      var _target = target
      if (_target.slice(-1) !== '/') _target += '/'
      _target = $url.resolve(_target, pathname)
      xRedirect(req, res, _target)
    }
  }
  if (type === 'sendfile') {
    return function(req, res){
      res.sendFile(target, { root: process.cwd() })
    }
  }
  if (type === 'status') {
    return function(req, res){
      res.status(target).end()
    }
  }
}

function createSlasher(key){
  return function(req, res, next){
    var pathname = req._parsedUrl.pathname
    if (pathname === '/') return next()
    if (key === '/') return next()
    if (key.slice(-1) === '/') {
      if (pathname === key.slice(0, -1)) {
        xRedirect(req, res, key)
      } else next()
    } else {
      if (pathname === key + '/') {
        xRedirect(req, res, '..' + key)
      } else next()
    }
  }
}

function xRedirect(req, res, target){
  var search = req._parsedUrl.search || ''
  res.redirect(target + search)
}

function forwardReq(req, isHttps){
  lowerKeys(req.headers)
  if (req.headers['x-forwarded-for']) {
    req.headers['x-forwarded-for'] += ', ' + req.ip
  } else {
    req.headers['x-forwarded-for'] = req.ip
  }
  let protocol = isHttps ? 'https' : 'http'
  let fullUrl = `${protocol}://${req.headers['host']}${req.originalUrl}`
  if (req.headers['x-forwarded-for-href']) {
    req.headers['x-forwarded-for-href'] += ' ' + fullUrl
  } else {
    req.headers['x-forwarded-for-href'] = fullUrl
  }
  // host header rewrites
  // req.headers['host'] = req.query['_host'] || ''
}

function lowerKeys(obj){
  _.each(obj, function(val, key, list){
    delete list[key]
    list[key.toLowerCase()] = val
  })
}

