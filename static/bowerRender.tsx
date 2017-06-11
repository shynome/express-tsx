void function(requirejs:Require,currentScript){
  var imports = JSON.parse(currentScript.text)
  var script_imports = imports.slice(1)
  var importsMap = script_imports.reduce(function(map,module_and_version){
    var module = module_and_version.split('?')[0]
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
    var Render = exports && exports.View || exports.default || exports
    ReactDOM.render(
      React.createElement( Render, data ),
      document.getElementById('app')
    )
  })
}(requirejs as any,document.currentScript || document.scripts[document.scripts.length-1] as any)