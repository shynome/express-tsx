
import React = require('react');
export default class F extends React.Component<any,any>{
  render(){
    return <div>
      class: {this.props.html}
    </div>
  }
}
