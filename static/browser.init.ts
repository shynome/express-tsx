declare var requirejs:any
declare var define:any
declare var imports:string[]
declare var EventSource:any
new class App {
  static regx = {
    nativeCode:/\[navtive code\]/,
    index:/\/index$/,
  }
  static normalize = (path:string)=>path.replace(/\\/g,'/')
  static currentScript = document.scripts[document.scripts.length-1]
  imports:string[] = JSON.parse(App.currentScript.innerText)
  static hotreload = App.currentScript.dataset.hotreload
  static dev = !!App.hotreload
  static baseurl = App.currentScript.dataset.baseurl
  static getModulename = module=>module.split('?').slice(0,1)[0].split('.').slice(0,-1)[0]
  static require = requirejs.s.contexts._
  static exportModule = exports=>exports
  static updateModule = (module)=>{
    let name = App.getModulename(module)
    let short_name = name.replace(App.regx.index,'')
    let hasUpdate = 0
    ;[ name, module, short_name, ].forEach(m=>{
      requirejs.defined(m) && hasUpdate++
      requirejs.undef(m)
    })
    App.defineModule(module)
    return !!hasUpdate
  }
  static defineModule = (module:string)=>{
    let name = App.getModulename(module)
    define(name,[module],App.exportModule)
    if( App.regx.index.test(name) ){
      name = name.replace(App.regx.index,'')
      define(name,[module],App.exportModule)
    }
    return name
  }
  constructor(){
    define('?props',[location.href+(location.href.indexOf('?')===-1?'?':'')+'&callback=define'],(data)=>data)
    if('assign' in Object && !App.regx.nativeCode.test(Object.assign.toString())){ define('es6-shim',null) }
    this.main = this.imports.map(App.defineModule)[0]
    requirejs([ ...this.deps, this.main, ],this.render)
    App.dev && this.hotreload()
  }
  main:string
  deps = ['react','react-dom']
  static mount = document.getElementById('app')
  static catch = (func)=>{
    try{
      func()
    }catch(err){
      console.error(err)
    }
  }
  render = (cb?:()=>void)=>App.catch(requirejs([this.main],function render(exports,){
    const React = requirejs('react')
    const ReactDOM = requirejs('react-dom')
    var View = exports.View || exports.default || exports
    var store = exports.props
    ReactDOM.render(
      React.isValidElement(View) ? View
      : React.createElement(
        View,
        store,
      ),
      App.mount
    )
    typeof cb === 'function' && cb()
  }))
  watcher:any
  hotreload = ()=>{
    this.watcher = new EventSource(App.hotreload)
    this.watcher.addEventListener('hotreload',this.update)
  }
  update = ({ data:module })=>{
    let hasUpdate = App.updateModule(module)
    let name = App.getModulename(module)
    if( name !== this.main ){
      App.updateModule(this.imports[0])
    }else{
      this.imports[0] = module
    }
    if( !hasUpdate ){ return }
    if(App.dev){
      console.log(`has update module : ${module}`)
      this.render(()=>{
        console.log(`view has rerender!`)
      })
    }else{
      this.render()
    }
  }
}