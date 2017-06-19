void function(requirejs:Require,currentScript:HTMLScriptElement){
  if('assign' in Object){
    define('es6-shim',function(){})
  }
  const imports:string[] = JSON.parse(currentScript.text)
  const script_imports = imports.slice(1)
  const importsMap = script_imports.reduce(function(map,module_and_version){
    const module = module_and_version.split('?')[0]
        map[module] = module_and_version
    return map
  },{})
  requirejs.config({
    map:script_imports.reduce(function(map,m){
      map[m] = importsMap
      return map
    },{})
  })
  requirejs(['react','react-dom'].concat(imports.slice(0,2)),function(React,ReactDOM,data,exports){
    const Render = exports && exports.View || exports.default || exports
    ReactDOM.render(
      React.createElement( Render, data ),
      document.getElementById('app')
    )
  })
}(requirejs as any,document.currentScript || document.scripts[document.scripts.length-1] as any)