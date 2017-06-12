import React = require('react')
import *as deep2 from './deep1'
import glamorous from 'glamorous'
const MyStyle = glamorous.div({
  color:'red',
  transition:'all 3s',
  ':hover':{
    color:'yellow'
  }
})
export default (props)=>
<MyStyle onClick={ ()=>alert(props.who) }>
  { JSON.stringify(deep2) }
  <br/>
  { JSON.stringify(props) }
</MyStyle>