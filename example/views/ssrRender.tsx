import '../ttt'
import { default as c } from '../b';
console.log(c)
export default (props)=>
<div onClick={ ()=>alert(props.who) }>
  hello {props.who}84848
</div>