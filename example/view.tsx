import React = require('react');
import { b } from './b'
console.log(b)
// debugger
import glamorous from 'glamorous'
const Styled = glamorous.div({
  '& h1':{
    'color':'red',
    '&:hover':{
      'color':'yellow',
    },
    '@media screen and (min-width:1200px)':{
      '&':{
        'color':'blue'
      }
    }
  }
})
import { App } from './App'
export class View extends React.Component<any,any>{
  render(){
    return(
    <App>
      <Styled>
        <h1>welcome to shylog , it's building...</h1>
      </Styled>
    </App>
    )
  }
}