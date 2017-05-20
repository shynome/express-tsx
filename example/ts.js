require('ts-node').register({ fast:true })
var path = require('path')
require('require-dynamic-exec').watch(path.join(__dirname,'../'),true)
require('./')