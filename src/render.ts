import { Compile, cacheDir, browserInitPath, deepForceUpdatePath } from ".";
export type renderData = {
  baseurl:string
  cache:true
  compiler:Compile
  compilerId:string
  requirejsId:string
  express_tsx_basePath:string
  requirejsConfigJsPathWithHash:string
  baseUrl:string
  hotreload:boolean
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
    express_tsx_hotreload_path,
    hotreload,
  } = data
  const requirejs = Requirejs.config({ context: requirejsId })
  const tourl = compiler.tourl(express_tsx_basePath)
  requirejsConfigJsPathWithHash = baseurl + requirejsConfigJsPathWithHash
  let imports = [ browserInitPath, deepForceUpdatePath, ...compiler.getImportsWithoutTypes(file), ]
  let [ _browserInitPath, _deepForceUpdate, ...imports_arr ] = imports.map(tourl)
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
    data-hotreload="${hotreload?`${express_tsx_hotreload_path}?renderFile=${encodeURI(file)}`:''}"
    data-updatejs="${_deepForceUpdate}"
    >
    ${JSON.stringify(imports_arr)}
  </script>
</body>
</html>
`
}