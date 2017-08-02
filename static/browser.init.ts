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
  updateModule = (module)=>{
    let name = App.getModulename(module)
    let short_name = name.replace(App.regx.index,'')
    let modules = [ name, module, short_name, ]
    if(name === this.main){ this.entry = module }
    modules.forEach(m=>requirejs.undef(m))
    return App.defineModule(module)
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
  main:string
  entry:string
  constructor(){
    define('?props',[location.href+(location.href.indexOf('?')===-1?'?':'')+'&callback=define'],(data)=>data)
    if('assign' in Object && !App.regx.nativeCode.test(Object.assign.toString())){ define('es6-shim',null) }
    this.entry = this.imports[0]
    this.main = this.imports.map(App.defineModule)[0]
    requirejs([ ...this.deps, this.main, ],this.render)
    App.dev && this.hotreload()
  }
  deps = ['react','react-dom']
  static catch = (func)=>{
    try{
      func()
    }catch(err){
      console.error(err)
    }
  }
  static mount = document.getElementById('app')
  render = (cb?:()=>void)=>App.catch(requirejs(
    [this.main],
    (exports,)=>{
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
    },
    (e)=>{
      e.requireModules.forEach(m=>requirejs.undef(m))
    }
  ))
  watcher:any
  hotreload = ()=>{
    this.watcher = new EventSource(App.hotreload)
    this.watcher.addEventListener('hotreload',this.update)
  }
  update = ({ data })=>App.catch(()=>{
    let module:string[] = JSON.parse(data)
    this.updateModule(this.entry)
    module.forEach(this.updateModule)
    if(App.dev){
      this.render(()=>{
        console.log(`view has rerender!`)
      })
    }else{
      this.render()
    }
  })
}