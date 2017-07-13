import React = require('react')
import *as obj from './importDeep'
console.log(obj)
export default ()=>
<div>
  { JSON.stringify(obj) }
</div>