import React = require('react');
import { App } from './App';
export default (props)=>
<App {...props}>
  hello {props.who}
</App>
