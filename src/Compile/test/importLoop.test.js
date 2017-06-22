require('ts-node').register({ fast:true, project:process.cwd() })
const path = require('path')
const { compile } = require('../')
const entryFile = path.join(__dirname,'./b.test.ts')//compile.scriptVersion[path.join(__dirname,'./b.test.ts')].filename
let deps = compile.getImports(entryFile)
console.log(deps)