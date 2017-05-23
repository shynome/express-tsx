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
import { config,basePath } from "./middleware";
import configExtend = require('config-extend')
export let etag = (module)=>compile.getScriptVersion(module)
export let ssrEtag = module=>module+'?v='+etag(module)
export let push = (file,data:config)=>{
  data = new config(data)
  let req = data.req
  let res = data.res
  let url = parse(req.originalUrl)
      url.search = url.search || ''
      url.search += '&callback=define'
  let dataurl = format(url)
  let imports = compile.getImports(file)
  res.setHeader('ETag',encodeURI(imports.map(ssrEtag).join(';')))
  let preloaded = decodeURI((req.header('if-none-match') || '')).split(';')
  let preload_imports = difference(imports.map(ssrEtag),preloaded).map(m=>m.split('?')[0])
  // debugger
  let relativePath = join(req.app.path(),basePath).replace(/\\/g,'/')
  let pushEtag = module=>encodeURI(`${relativePath}/${module.replace(/\.(tsx|ts|js|jsx)$/,'')}?v=${etag(module)}`)
  let preload_imports_path = preload_imports.map(pushEtag)
  if(res.push){// http2 push
    res.push(dataurl,dataContentType).end(`define(${JSON.stringify(res.ViewData)})`)
    preload_imports.forEach((module,index)=>{
      let modulePath = preload_imports_path[index]
      let body = compile.compile(module).outputFiles[0].text
      res.push(modulePath,configExtend({ response:{ ETag:etag(body) } },contentType)).end(body)
      return modulePath
    })
  }
  data.imports = [dataurl].concat(imports.map(pushEtag))
  res.setHeader('Link',[dataurl].concat(preload_imports_path).map(path=>`<${path}>; rel=preload; as=script`).join(','))
  return data
}