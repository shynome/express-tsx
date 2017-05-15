import React = require('react')
import *as deep2 from './deep1'
export default (props)=>
<div onClick={ ()=>alert(props.who) }>
  {
    JSON.stringify(deep2)
  }
</div>