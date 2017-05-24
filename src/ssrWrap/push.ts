import { compile } from "./Compile";
import { request } from "http";
import { format, Url, parse } from "url";
import { relative,join } from 'path'
import { difference } from "lodash";
import { maxAge } from "./middleware";
export const contentType = {
  request:{
    accept:'*/*',
  },
  response:{
    'content-type'    :'application/javascript',
    'Cache-Control'   :'max-age='+maxAge,
  }
}
export const dataContentType = {
  request:{
    accept:'*/*',
  },
  response:{
    'content-type'    :'application/javascript',
    'Cache-Control'   :'no-cache',
  }
}
import { basePath } from "./middleware";
import configExtend = require('config-extend')
export let etag = (module)=>compile.getScriptVersion(module)
export let ssrEtag = module=>module+'?v='+etag(module)
import { Response,Request } from "express";
import { config } from "../";
import { bowerRenderScript } from "./ssrWrap";
import { requirejsConfigPath } from "./requirejs";
export let push = function push(body:string, ViewData:config, file:string,data:config){
  let req = data.req
  let res = data.res
  //make dataurl
  let url = parse(req.originalUrl)
      url.search = url.search || ''
      url.search += '&callback=define'
  let dataurl = format(url)
  //get imports
  let imports = compile.getImports(file).concat([requirejsConfigPath,bowerRenderScript])
  //get need preload_imports
  res.setHeader('ETag',encodeURI(imports.map(ssrEtag).join(';')))
  let preloaded = decodeURI((req.header('if-none-match') || '')).split(';')
  let preload_imports = difference(imports.map(ssrEtag),preloaded).map(m=>m.split('?')[0])
  let relativePath = join(req.app.path(),basePath).replace(/\\/g,'/')
  /**map module to absolute url */ 
  let pushEtag = module=>encodeURI(`${relativePath}/${module.replace(/\.(tsx|ts|js|jsx)$/,'')}?v=${etag(module)}`)
  let preload_imports_path = preload_imports.map(pushEtag)
  // http2 push
  if(res.push){
    res.push(dataurl,dataContentType).end(`define(${JSON.stringify(ViewData)})`)
    preload_imports.forEach((module,index)=>{
      let modulePath = preload_imports_path[index]
      let body = compile.compile(module).outputFiles[0].text
      res.push(modulePath,configExtend({ response:{ ETag:etag(module) } },contentType)).end(body)
      return modulePath
    })
  }
  //preload
  res.setHeader('Link',[dataurl].concat(preload_imports_path).map(path=>`<${path}>; rel=preload; as=script`).join(','))
  //return  dataurl and imports
  return {
    imports:[dataurl].concat(imports.map(pushEtag)),
    pushEtag,
  }
}