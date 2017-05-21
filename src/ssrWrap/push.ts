import { compile } from "./Compile";
import { request } from "http";
import { format, Url, parse } from "url";
import { relative,join } from 'path'
import { difference } from "lodash";
import { MaxAge } from "./middleware";
export const contentType = {
  request:{
    accept:'*/*',
  },
  response:{
    'content-type'    :'application/javascript',
    'Cache-Control'   :'max-age='+MaxAge,
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
import { config,basePath } from "./middleware";
import configExtend = require('config-extend')
import etag = require('etag')
export let push = (file,data:config)=>{
  data = new config(data)
  let req = data.req
  let res = data.res
  let url = parse(req.originalUrl)
      url.search = url.search || ''
      url.search += '&callback=define'
  let dataurl = format(url)
  let imports = compile.getImports(file)
  res.setHeader('ETag',encodeURI(imports.join(';')))
  let preloaded = (req.header('if-none-match') || '').split(';')
      imports =   difference(imports,preloaded)
  // debugger
  let relativePath = join(req.app.path(),basePath).replace(/\\/g,'/')
  let imports_path = 
    imports.map(module=>`${relativePath}?version=${compile.getScriptVersion(module)}&filename=${module}`)
    .map(m=>m.replace(/\.(tsx|ts|js|jsx)$/,''))
    .map(encodeURI)
  if(res.push){// http2 push
    res.push(dataurl,dataContentType).end(`define(${JSON.stringify(res.ViewData)})`)
    imports.forEach((module,index)=>{
      let body = compile.compile(module).outputFiles[0].text
      res.push(imports_path[index],configExtend({ response:{ ETag:etag(body,{ weak:true }) } },contentType)).end(body)
    })
  }
  imports = imports_path
  data.imports = [dataurl].concat(imports)
  res.setHeader('Link',data.imports.map(path=>`<${path}>; rel=preload; as=script`).join(','))
  return data
}