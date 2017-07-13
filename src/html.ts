import requirejs = require('requirejs')
requirejs.config({
  paths:{
    'react'     :'//cdn.bootcss.com/react/15.6.1/react.js#',
    'react-dom' :'//cdn.bootcss.com/react/15.6.1/react-dom.js#',
    'requirejs' :'//cdn.bootcss.com/require.js/2.3.3/require.min.js#',
    'css'       :'//cdn.bootcss.com/require-css/0.1.10/css.min.js#'
  }
})
export const getRequirejsConfig = ()=>JSON.stringify(requirejs.s.contexts._.config)
import { data } from "./render";
export const html = async(file:string,data:data,imports:string[]):Promise<string>=>{
return `
<!DOCTYPE html>
<html lang="${data.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${data.title}</title>
</head>
<body>
  <div id="app"></div>
  <script>var requirejs = ${getRequirejsConfig()}</script>
  <script src="${requirejs.toUrl('requirejs')}"></script>
  <script>
    var imports = /* ['s']// */${JSON.stringify(imports)}
        imports = imports.map(function(path){ return '/express-tsx/'+path })
    var map = imports.reduce(function(target,module){
      var name = module.split('?').slice(0,1)[0].split('.').slice(0,-1)[0]
      target[name] = module
      if(/\\\/index$/.test(name)){
        target[name.replace(/\\\/index$/,'')] = module        
      }
      return target
    },{})
    var b = imports.reduce(function(target,module){
      var name = module//.split('?').slice(0,1)[0].split('.').slice(0,-1)
      target[name] = map
      return target
    },{})
    requirejs.config({
      map:b
    })
    var dataurl = location.href
        if(dataurl.indexOf('?')===-1){ dataurl+='?' }
        dataurl += '&callback=define'
    requirejs(['react','react-dom',imports[0],dataurl],function(React,ReactDOM,exports,data){
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