import { compile } from "./Compile";
import { request } from "http";
import { format, Url, parse } from "url";
import { relative,join } from 'path'
export let contentType = {
  request:{
    accept:'*/*',
  },
  response:{
    'content-type':'application/javascript',
  }
}
import { config,basePath } from "./middleware";
export let push = (file,data:config)=>{
  data = new config(data)
  let req = data.req
  let res = data.res
  let dataurl = '?callback=define'
  let imports = compile.getImports(file)
  let relativePath = join(req.app.path(),basePath).replace(/\\/g,'/')
  let imports_path = 
    imports.map(module=>`${relativePath}?filename=${module}`)
    .map(m=>m.replace(/\.(tsx|ts|js|jsx)$/,''))
    .map(encodeURI)
  if(res.push){// http2 push
    // res.push(dataurl,contentType).end(JSON.stringify(data))
    imports.forEach((module,index)=>{
      res.push(imports_path[index],contentType).end(compile.compile(module).outputFiles[0].text)
    })
  }
  imports = imports_path
  data.imports = [dataurl].concat(imports)
  return data
}