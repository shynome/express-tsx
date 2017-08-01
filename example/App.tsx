import React = require('react')
export class App extends React.Component<any,any>{
  render() {
    return (
    <div>
      {this.props.children}
         {/* 555    */}
    </div>
    )
  }
}