const path = require('path')
require('ts-node').register({ fast:true, project:process.cwd() })
const { compile } = require('./')
const entryFile = compile.files[path.join(__dirname,'../../static/bowerRender.tsx')].filename
let deps = compile.getAllImports(entryFile)
console.log(deps)
debugger
