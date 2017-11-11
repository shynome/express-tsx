import { Express } from "express";
import { key, compiler, Compile, Vars, browserInitPath, deepForceUpdatePath } from ".";
import path = require('path')
export const html = (arr:any)=>[].concat(arr).filter(v=>typeof v==='string').join('\r\n')
export function render(file:string,data:any,cb:any=()=>0){
  const app:Express = data.app
  const compiler:Compile = app.get(key.compiler)
  compiler.compilerOptions.sourceMap = compiler.development
  const requirejs = app.get(key.requirejs)
  compiler.getScriptVersion(file)//compile files
  const tourl = compiler.tourl(data.express_tsx_basePath)
  let requirejsConfigJsPathWithHash = data.baseUrl+app.get(key.requirejsConfigJsPathWithHash)
  let imports = [ browserInitPath, deepForceUpdatePath, ...compiler.getImportsWithoutTypes(file), ]
  imports = imports.map(tourl)
  let [ _browserInitPath, deepForceUpdate, ...imports_arr ] = imports
cb(null,`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${data.title}</title>
  <script src="${requirejs.toUrl('requirejs')}"></script>
  <script src="${requirejsConfigJsPathWithHash}"></script>
</head>
<body>
  <div id="app"></div>
  <script
    src="${_browserInitPath}" 
    data-baseurl="${data.express_tsx_basePath}"
    data-hotreload="${data.hotreload?`${data.express_tsx_hotreload_path}?renderFile=${encodeURI(file)}`:''}"
    data-updatejs="${deepForceUpdate}"
    >
    ${JSON.stringify(imports_arr)}
  </script>
</body>
</html>
`)
  return imports
}
