import React = require('react')
import *as obj from './end'
import { Article } from './Article';
let a:Article = null
console.log(a)
export default ()=>
<div>
  { JSON.stringify(obj) }
</div>