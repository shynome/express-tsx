import React = require('react')
import { App } from './App';
export const props = require('?state');import '?state'
//init
props.value = props.value || 1
console.log(props)
export class View extends React.Component<any,any>{
  render(){
    console.log(this.props)
    return (
    <form action="#" onSubmit={(e)=>{e.preventDefault();props.value+=1;console.log(props)}}>
      <input type="text" defaultValue={this.props.value} />
    </form>
    )
  }
}