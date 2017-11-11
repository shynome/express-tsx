import { Compile, cacheDir, browserInitPath, deepForceUpdatePath } from ".";
export type renderData = {
  cache:true
  compiler:Compile
  requirejsId:string
  express_tsx_basePath:string
  requirejsConfigJsPathWithHash:string
  baseUrl:string
}
export class htmlData {
  [key:string]:any
  lang?:string = 'en'
  title?:string = 'express-tsx'
  keywords?:string|string[] = []
  description?:string = ''
  heads?:string[] = []
  loading?:string = 'loading'
  foots?:string[] = []
}
export type data = renderData & htmlData
import path = require('path')
import Requirejs = require('requirejs')
export const render = async(file:string,data:data):Promise<string>=>{
  let {
    compiler, 
    requirejsId,
    express_tsx_basePath,
    requirejsConfigJsPathWithHash,
    baseurl,
  } = data
  const requirejs = Requirejs.config({ context: requirejsId })
  const tourl = compiler.tourl(data.express_tsx_basePath)
  requirejsConfigJsPathWithHash = baseurl + requirejsConfigJsPathWithHash
  let imports = [ browserInitPath, deepForceUpdatePath, ...compiler.getImportsWithoutTypes(file), ]
  imports = imports.map(tourl)
  let [ _browserInitPath, deepForceUpdate, ...imports_arr ] = imports
return `<!DOCTYPE html>
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
`
}