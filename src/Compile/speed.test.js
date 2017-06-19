const cwd = process.cwd()
const path = require('path')
require('ts-node').register({ fast:true, project:cwd })
const file = path.join(cwd,'views/ssrRender.tsx')
const file2 = path.join(cwd,'views/deep1.tsx')
const { Compile } = require('./Compile')
let c = new Compile()

c.getImports(file)

console.time('ss')
let c1 = c.service.getEmitOutput(file)
console.timeEnd('ss')

console.time('ss')
let c2 = c.service.getEmitOutput(file)
console.timeEnd('ss')

console.time('ss')
let c11 = c.service.getEmitOutput(file2)
console.timeEnd('ss')

console.time('ss')
let c12 = c.service.getEmitOutput(file2)
console.timeEnd('ss')

debugger