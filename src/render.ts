import { compiler } from "./middleware";
import './requirejs.config'
import requirejs = require('requirejs');
export class ViewData {
  [key: string]: any
  constructor(data:ViewData = {} ) {
    Object.assign(this,data)
  }
  lang?:string = 'en'
  hotreload?:boolean = false
  express_tsx_basePath?:string
  express_tsx_hotreload_path?:string
  //seo
  description?:string
  keywords?:string
  title?:string = 'express-tsx'
  heads?:string[]
  metas?:string[]
}
import path = require('path')
export const browserInitPath:string = requirejs.toUrl('browserInitPath')
export const requirejsConfigPath:string = requirejs.toUrl('requirejsConfigPath')
export const html = (arr:any)=>[].concat(arr).filter(v=>typeof v==='string').join('\r\n')
export function render(file:string,data:ViewData,cb:any=()=>0){
  compiler.getScriptVersion(file)//compile entry file
  data = new ViewData(data)
  let tourl = compiler.tourl(data.express_tsx_basePath)
  let imports = [ browserInitPath, requirejsConfigPath, ...compiler.getImportsWithoutTypes(file), ]
      imports = imports.map(tourl)
  let [ _browserInitPath, _requirejsConfigPath, ...imports_arr ] = imports

cb(null,`<!DOCTYPE html>
<html lang="${data.lang}">
<head>
  <meta charset="UTF-8">
  ${html([
  data.description && `<meta name="description" content="${encodeURI(data.description)}">`,
  data.keywords && `<meta name="keywords" content="${encodeURI(data.keywords)}">`,
  ].concat(data.metas))}
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${data.title}</title>
  <script src="${requirejs.toUrl('requirejs')}"></script>
  <script src="${_requirejsConfigPath}"></script>
  ${html(data.heads)}
</head>
<body>
  <div id="app"></div>
  <script
    src="${_browserInitPath}" 
    data-baseurl="${data.express_tsx_basePath}"
    data-hotreload="${data.hotreload?`${data.express_tsx_hotreload_path}?renderFile=${encodeURI(file)}`:''}"
    >
    ${JSON.stringify(imports_arr)}
  </script>
</body>
</html>
`)
  return imports
}
