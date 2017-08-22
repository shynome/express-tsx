import React = require('react')
import { App } from './App';
import *as u from './header'
// sdfdasf
class State {
  title = 'name'
}
export const props = new State()
export class View extends React.Component<State,void>{
  render(){
    console.log(this.props)
    return (
    <App>
      <form action="#" onSubmit={(e)=>{e.preventDefault();}}>
        <input type="text" defaultValue={'5555'} />
      </form>
    </App>
    )
  }
}