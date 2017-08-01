import { compiler } from "../Compile";
import requirejs = require('requirejs');
export class ViewData {
  [key: string]: any
  constructor(data:ViewData = {} ) {
    Object.assign(this,data)
  }
  lang?:string = 'en'
  description?:string
  keywords?:string
  title?:string = 'express-tsx'
  heads?:string[]
  metas?:string[]
}
import path = require('path')
export const browserInitPath = path.join(__dirname,'../../static/browser.init.ts')
export const requirejsConfigPath = path.join(__dirname,'../../static/requirejs.browser.config.ts')
export const html = (arr:any)=>[].concat(arr).filter(v=>typeof v==='string').join('\r\n')
export function render(file,data:ViewData,cb){
  
  data = new ViewData(data)
  let imports =  [ browserInitPath, requirejsConfigPath, ...compiler.getImportsWithoutTypes(file) ]
  let [ _browserInitPath, _requirejsConfigPath, ...imports_arr ] = imports.map(m=>data.express_tsx_basePath+m+`?v=${compiler.getScriptVersion(m)}`).map((m)=>m.replace(/\\/g,'/'))

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
  <script src="${_browserInitPath}">${JSON.stringify(imports_arr)}</script>
</body>
</html>
`)
}
