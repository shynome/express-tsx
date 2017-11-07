import React = require('react')
export default class extends React.Component<void,{ show:boolean }> {
  state = { show:true }
  render(){
    return <div>
      <div>
        <button onClick={()=>this.setState({show:true})}>show</button>
        <button onClick={()=>this.setState({show:false})}>hidden</button>
      </div>
      { this.state.show && <div>sho555sddsdfegfegtw</div> }
    </div>
  }
}