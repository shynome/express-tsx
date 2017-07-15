declare var requirejs:any
declare var define:any
var imports:string[] = JSON.parse(document.scripts[document.scripts.length-1].text)
  var regx = {
    nativeCode:/\[navtive code\]/,
    index:/\/index$/,
  }
  if(!regx.nativeCode.test(Array.prototype.forEach.toString())){ define('es5-shim',null) }
  if(!regx.nativeCode.test(Array.prototype.forEach.toString())){ define('es6-shim',null) }
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