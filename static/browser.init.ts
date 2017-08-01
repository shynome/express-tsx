declare var requirejs:any
declare var define:any
declare var imports:string[]
void function module_map(global:any,imports_str){
  var imports:string[] = global.imports = JSON.parse(imports_str)
  var regx = {
    nativeCode:/\[navtive code\]/,
    index:/\/index$/,
  }
  if('assign' in Object && !regx.nativeCode.test(Object.assign.toString())){ define('es6-shim',null) }
  imports.forEach(function(module){
    var name = module.split('?').slice(0,1)[0].split('.').slice(0,-1)[0]
    define(name,[module],function(exports){ return exports })
    if( regx.index.test(name) ){
      name = module.replace(regx.index,'')
      define(name,[module],function(exports){ return exports })
    }
  })
}(window,document.scripts[document.scripts.length-1].text,)
define('?props',[location.href+(location.href.indexOf('?')===-1?'?':'')+'&callback=define'],(data)=>data)
requirejs([ 'react','react-dom', imports[0], ],function render(React,ReactDOM,exports){
  var View = exports.View || exports.default || exports
  var store = exports.props
  //hooks store for hot reload
  // ...code
  ReactDOM.render(
    React.isValidElement(View) ? View
    : React.createElement(
      View,
      store,
    ),
    document.getElementById('app')
  )
})