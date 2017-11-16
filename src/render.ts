import { Compile, Vars, cacheDir, browserInitPath, deepForceUpdatePath } from ".";
export type renderData = {
  baseUrl:string
  cache:true
  compiler:Compile
  compilerId:string
  requirejsId:string
  express_tsx_path:string
  express_tsx_hotreload_path:string
  requirejsConfigJsPathWithHash:string
  hotreload:boolean
}
export class HtmlData {
  [key:string]:any
  lang?:string = 'en'
  title?:string = 'express-tsx'
  keywords?:string = ''
  description?:string = ''
  generator?:string = 'express-tsx'
  heads?:string = ''
  loading?:string = 'loading'
  foots?:string = ''
}
export type data = { settings:renderData } & HtmlData
import path = require('path')
import Requirejs = require('requirejs')
export const getCompiledImports = (file:string,compiler:Compile):string[]=>[ browserInitPath, deepForceUpdatePath, ...compiler.getImportsWithoutTypes(file), ]
export const echoif = (x,str=x)=>x != false ? str : ''
export const render = async(file:string,data:data):Promise<string>=>{
  let {
    compiler, 
    requirejsId,
    requirejsConfigJsPathWithHash,
    baseUrl,
    express_tsx_path,
    express_tsx_hotreload_path,
    hotreload,
  } = data.settings
  const requirejs = Requirejs.config({ context: requirejsId })
  const tourl = compiler.tourl(express_tsx_path)
  requirejsConfigJsPathWithHash = baseUrl + requirejsConfigJsPathWithHash
  compiler.getScriptVersion(file)
  let [ browserInitPath, deepForceUpdate, ...imports_arr ] = getCompiledImports(file,compiler).map(tourl)
return `<!DOCTYPE html>
<html ${echoif(data.lang,`lang=${data.lang}`)}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  ${echoif(data.title,`<title>${data.title}</title>`)}
  ${echoif(data.keywords,`<meta name="keywords" content="${data.keywords}">`)}
  ${echoif(data.description,`<meta name="description" content="${data.description}">`)}
  ${echoif(data.generator,`<meta name="generator" content="${data.generator}">`)}
  ${echoif(data.heads)}
  <script src="${requirejs.toUrl('requirejs')}"></script>
  <script src="${requirejsConfigJsPathWithHash}"></script>
</head>
<body>
  ${echoif(data.foots)}
  <div id="app"></div>
  <script
    src="${browserInitPath}" 
    data-baseurl="${data.express_tsx_basePath}"
    data-hotreload="${hotreload?`${express_tsx_hotreload_path}?renderFile=${encodeURI(file)}`:''}"
    data-updatejs="${deepForceUpdate}"
    >
    ${JSON.stringify(imports_arr)}
  </script>
  ${echoif(data.foots)}
</body>
</html>
`
}