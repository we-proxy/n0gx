#!/usr/bin/env node
var n0gx = require('../')
var filepath = process.argv[2]
var path = require('path')

if (!filepath) throw new Error('conf file path needed')
var cwd = process.cwd()
var conf = require(path.resolve(cwd, filepath))

var server = n0gx(conf, function(e){
  if (e) throw e
  console.log('started on %d', server.address().port)
})
