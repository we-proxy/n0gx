#!/usr/bin/env node
var n0gx = require('../')
var filepath = process.argv[2]
var port = +process.argv[3]
var path = require('path')

if (!filepath) throw new Error('conf path required')
if (!port) throw new Error('port required')
var cwd = process.cwd()
var conf = require(path.resolve(cwd, filepath))

var app = n0gx(conf)
var server = app.listen(port, function(e){
  if (e) throw e
  console.log('started on', server.address().port)
})
