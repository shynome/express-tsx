declare var requirejs:any
declare var define:any
void function(global:any,imports_str){
  var imports:string[] = global.imports = JSON.parse(imports_str)
  var regx = {
    nativeCode:/\[navtive code\]/,
    index:/\/index$/,
  }
  if('forEach' in Array.prototype && !regx.nativeCode.test(Array.prototype.forEach.toString())){ define('es5-shim',null) }
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