const requirejs = require('requirejs')
const express_tsx = require('../')
const html = exports.html = async(file,data,view_data)=>{
  let compiler = data.res.locals.express_tsx_compiler
      compiler.getScriptVersion(file)//compile entry file
  let imports = compiler.getImportsWithoutTypes(file)
  let preload_imports = [ express_tsx.browserInitPath, express_tsx.requirejsConfigPath, ...imports ]
      preload_imports = preload_imports.map(m=>data.express_tsx_basePath+m+`?v=${compiler.getScriptVersion(m)}`)
  let [ _browserInitPath, _requirejsConfigPath, ...imports_arr ] = preload_imports
  express_tsx.preload(data,preload_imports)
  return `<!DOCTYPE html>
<html lang="${view_data.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${view_data.title}</title>
</head>
<body>
  render by diy html function
  <div id="app"></div>
  <script src="${requirejs.toUrl('requirejs')}"></script>
  <script src="${_browserInitPath}">${JSON.stringify(imports_arr)}</script>
  <script src="${_requirejsConfigPath}"></script>
  <script>
  requirejs([
    'react','react-dom',
    imports[0],
    location.href+(location.href.indexOf('?')===-1?'?':'')+'&callback=define'
  ],function(React,ReactDOM,exports,data){
    var View = exports && exports.View || exports.default || exports
    ReactDOM.render(
      React.createElement(
        View,
        data
      ),
      document.getElementById('app')
    )
  })
  </script>
</body>
</html>
`
}