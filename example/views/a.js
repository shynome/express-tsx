
var ts = require('typescript')
var fs = require('fs')
var js = ts.transpile(fs.readFileSync(__dirname+'/index.tsx','utf8'),{
  target:ts.ScriptTarget.ES5,
  module:ts.ModuleKind.AMD,
  outFile:'bundle.js',
  sourceMap:true,
  inlineSourceMap:true,
  jsx:ts.JsxEmit.React,
  inlineSources:true,
})
console.log(js)