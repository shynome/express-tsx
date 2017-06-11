require('ts-node').register({ fast:true, project:process.cwd() })
const requirejs = require('./requirejs').requirejs
console.log(requirejs.toUrl('requirejs'))
debugger