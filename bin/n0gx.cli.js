#!/usr/bin/env node
var n0gx = require('../')
var filepath = process.argv[2]
var httpPort = +process.argv[3] || 80
var httpsPort = +process.argv[4] || 443
var path = require('path')

if (!filepath) throw new Error('conf path required')
if (!httpPort) throw new Error('httpPrt required')
if (!httpsPort) throw new Error('httpsPort required')
var cwd = process.cwd()
var conf = require(path.resolve(cwd, filepath))

var ret = n0gx(conf, true)
var httpsApp = ret.app
var serverUpgradeHandler = ret.serverUpgradeHandler

// opt.1 no force http to https
// var httpApp = n0gx(conf)

// opt.2 force http to https
var express = require('express')
var httpApp = express()
// 移除 X-Powered-By 响应头
httpApp.disable('x-powered-by');
httpApp.get('*', function (req, res) {
  var httpsUrl = `https://${req.get('host')}${req.url}`
  res.redirect(302, httpsUrl)
})

var fs = require('fs')
var http = require('http')
var https = require('https')

// TODO: read from process.env vars
var domain = 'fritx.me'
var basedir = '/root/.acme.sh'

// var ifecc = '_ecc'
var ifecc = ''

var keyfile = `${basedir}/${domain}${ifecc}/${domain}.key`
var certfile = `${basedir}/${domain}${ifecc}/fullchain.cer`

var key  = fs.readFileSync(keyfile, 'utf8')
var cert = fs.readFileSync(certfile, 'utf8')
var credentials = { key, cert }

var httpServer = http.createServer(httpApp)
var httpsServer = https.createServer(credentials, httpsApp)
httpsServer.on('upgrade', serverUpgradeHandler)

httpServer.listen(httpPort, function (e) {
  if (e) throw e
  console.log('started on', httpServer.address().port)
})
httpsServer.listen(httpsPort, function (e) {
  if (e) throw e
  console.log('started on', httpsServer.address().port)
})
