import { Compile, Vars, cacheDir, browserInitPath, deepForceUpdatePath } from ".";
export type renderData = {
  baseUrl:string
  cache:true
  compiler:Compile
  compilerId:string
  requirejsId:string
  express_tsx_basePath:string
  requirejsConfigJsPathWithHash:string
  hotreload:boolean
}
export class HtmlData {
  [key:string]:any
  lang?:string = 'en'
  title?:string = 'express-tsx'
  keywords?:string|string[] = []
  description?:string = ''
  heads?:string[] = []
  loading?:string = 'loading'
  foots?:string[] = []
}
export type data = renderData & HtmlData
import path = require('path')
import Requirejs = require('requirejs')
export const getCompiledImports = (file:string,compiler:Compile):string[]=>[ browserInitPath, deepForceUpdatePath, ...compiler.getImportsWithoutTypes(file), ]
export const render = async(file:string,data:data):Promise<string>=>{
  let {
    compiler, 
    requirejsId,
    requirejsConfigJsPathWithHash,
    baseUrl,
    hotreload,
  } = data
  const express_tsx_basePath = path.join(baseUrl,Vars.express_tsx_path).replace(/\\/g,'/')
  const express_tsx_hotreload_path = path.join(baseUrl,Vars.express_tsx_hotreload_path).replace(/\\/g,'/')
  const requirejs = Requirejs.config({ context: requirejsId })
  const tourl = compiler.tourl(express_tsx_basePath)
  requirejsConfigJsPathWithHash = baseUrl + requirejsConfigJsPathWithHash
  let [ browserInitPath, deepForceUpdate, ...imports_arr ] = getCompiledImports(file,compiler).map(tourl)
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
    src="${browserInitPath}" 
    data-baseurl="${data.express_tsx_basePath}"
    data-hotreload="${hotreload?`${express_tsx_hotreload_path}?renderFile=${encodeURI(file)}`:''}"
    data-updatejs="${deepForceUpdate}"
    >
    ${JSON.stringify(imports_arr)}
  </script>
</body>
</html>
`
}