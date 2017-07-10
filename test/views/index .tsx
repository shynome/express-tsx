import *as obj from './a'
import React = require('react')
import { deep, deep2 } from './deep'
export default ()=>
<div>
  { JSON.stringify({ ...obj, deep, deep2 }) }
</div>