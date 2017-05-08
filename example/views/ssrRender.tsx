import React = require('react')
import *as deep from './deep1'
console.log(deep)

export default (props)=>
<div onClick={ ()=>alert(props.who) }>
  hello {props.who}84848
  <span style={{color:'red'}}>ddddddddddddd</span>
</div>