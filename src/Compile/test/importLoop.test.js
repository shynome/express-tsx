require('ts-node').register({ fast:true, project:process.cwd() })
const path = require('path')
const { compile } = require('../')
const entryFile = compile.scriptVersion[path.join(__dirname,'./b.test.ts')].filename
let deps = compile.getAllImports(entryFile)
console.log(deps)