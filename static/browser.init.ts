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
  var map = imports.reduce(function(target,module){
    var name = module.split('?').slice(0,1)[0].split('.').slice(0,-1)[0]
    target[name] = module
    if(regx.index.test(name)){
      target[name.replace(regx.index,'')] = module        
    }
    return target
  },{})
  var all_map = imports.reduce(function(target,module){
    var name = module//.split('?').slice(0,1)[0].split('.').slice(0,-1)
    target[name] = map
    return target
  },{})
  requirejs.config({
    map:all_map
  })
}(window,document.scripts[document.scripts.length-1].text,)
define('?props',[location.href+(location.href.indexOf('?')===-1?'?':'')+'&callback=define'],(data)=>data)
requirejs([ 'react','react-dom', imports[0], ],function render(React,ReactDOM,exports){
  var View = exports.View || exports.default || exports
  var data = exports.props
  ReactDOM.render(
    React.createElement(
      View,
      data,
    ),
    document.getElementById('app')
  )
})