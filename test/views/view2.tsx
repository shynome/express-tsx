import React = require('react')
import *as obj from './importDeep'
console.log(obj)
debugger
export default ()=>
<div>
  { JSON.stringify(obj) }
</div>