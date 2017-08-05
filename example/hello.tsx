import React = require('react')
console.log('express-tsx' as any)
export type Props = { word:string }
export const props = require('?props');import '?props';
export const View:React.StatelessComponent<Props> = (props)=>
<div>
  hello {props.word}
</div>