declare var requirejs:any 
declare var define:any 
declare var imports:string[] 
declare var EventSource:any 
define('?props',[location.href.split('#')[0]+(location.href.indexOf('?')===-1?'?':'')+'&callback=define'],(data)=>data) 
void function(){//scope

const currentScript = document.scripts[document.scripts.length-1]
let imports:string[] = JSON.parse(currentScript.innerText) 
const normalize = (path:string)=>path.replace(/\\/g,'/') 
const hotreload = currentScript.getAttribute('data-hotreload') 
const dev = !!hotreload
const updatejs =  currentScript.getAttribute('data-updatejs')
class Manager {
  static regx = { 
    nativeCode:/\[navtive code\]/, 
    index:/\/index$/, 
  }
  static getModulename = module=>module.split('?').slice(0,1)[0].split('.').slice(0,-1)[0] 
  static exportModule = exports=>exports 
  static defineModule = (module:string)=>{ 
    let name = Manager.getModulename(module) 
    define(name,[module],Manager.exportModule) 
    if( Manager.regx.index.test(name) ){ 
      name = name.replace(Manager.regx.index,'') 
      define(name,[module],Manager.exportModule) 
    } 
    return name 
  }
  main:string
  entry:string
  updateModule = (module:string)=>{
    let name = Manager.getModulename(module) 
    let short_name = name.replace(Manager.regx.index,'') 
    let modules = [ name, module, short_name, ] 
    if(name === this.main){ this.entry = module } 
    modules.forEach(m=>requirejs.undef(m)) 
    return Manager.defineModule(module) 
  }
  constructor(imports:string[]){
    this.entry = imports[0] 
    this.main = imports.map(Manager.defineModule)[0] 
  }
}
const getView = (exports)=>exports.View || exports.default || exports 
const manager = new Manager(imports)
requirejs(
  ['react','react-dom',manager.main,].concat(dev && [updatejs, typeof EventSource !== 'function' && 'event-source-polyfill']),
function(react,ReactDOM,exports,updatejs){
  //AppContainer
  let view = getView(exports)
  let props = exports.props
  const deepForceUpdate = updatejs ? updatejs.default : ()=>{}
  class AppContainer extends (react.Component as { new ():any }) {
    constructor(...r){
      super(...r)
      this.state = this.props
      if(updatejs){
        let watcher = new EventSource(hotreload) 
        watcher.addEventListener('hotreload',this.update)
      }
    }
    update = ({ data })=>{
      let module:string[] = JSON.parse(data) 
      module.forEach(manager.updateModule)
      requirejs([manager.main],(exports)=>{
        this.setState({
          view: getView(exports),
          props: exports.props,
        })
      })
    }
    componentWillReceiveProps(){
      deepForceUpdate(this)
    }
    render(){
      let { view, props } = this.state
      return react.isValidElement(view)?view:react.createElement(view,props)
    }
  }
  const root = react.createElement(AppContainer as any,{ view, props })
  ReactDOM.render(root,document.getElementById('app'))
})

}()