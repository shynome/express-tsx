import React = require('react')
export type Store = { word:string }
export const props = require('?props');import '?props'
console.log('express-tsx' as any)
export default (props:Store)=>
<div>
  hello {props.word}
</div>