
import { config } from "./middleware";
import { requirejsScript,requirejs } from './requirejs'
import { ssrWrap } from './'
import { push } from "./push";
export const wrap:ssrWrap = ( body, file, data:config, )=>{
  data = push(file,data)
return `
<!DOCTYPE html>
<html lang="${ data.lang }">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="X-UA-Compatible" content="ie=edge"/>
<title>${ data.title }</title>
</head>
<body>
  <div id="app">${ body }</div>
  <script>${requirejsScript}</script>
  <script src="${requirejs.paths['requirejs']}.js"></script>
  <script>
  var imports = ${JSON.stringify(data.imports)}.slice(1)
  var importsMap = imports.reduce(function(map,module_and_version){
    var module = module_and_version.split('?')[0]
        map[module] = module_and_version
    return map
  },{})
  requirejs.config({
    map:imports.reduce(function(map,m){
      map[m] = importsMap
      return map
    },{})
  })
  </script>
  <script>
  require(['react','react-dom'].concat(${JSON.stringify(data.imports.slice(0,2))}),function(React,ReactDOM,data,exports){
    var Render = exports && exports.View || exports.default || exports
    ReactDOM.render(
      React.createElement( Render, data ),
      document.getElementById('app')
    )
  })
  </script>
</body>
</html>
`
}