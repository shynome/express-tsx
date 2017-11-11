import { Compile, cacheDir, browserInitPath, deepForceUpdatePath } from ".";

export type data = {
  [key:string]:any
  cache:true
  compiler:Compile
  requirejsId:string
  express_tsx_basePath:string
  requirejsConfigJsPathWithHash:string
  baseUrl:string
}
import path = require('path')
import requirejs = require('requirejs')
export const render = async(file:string,data:data):Promise<string>=>{
  let {
    compiler, 
    requirejsId,
    express_tsx_basePath,
    requirejsConfigJsPathWithHash,
    baseurl,
  } = data
  const tourl = compiler.tourl(data.express_tsx_basePath)
  requirejsConfigJsPathWithHash = baseurl + requirejsConfigJsPathWithHash
  let imports = [ browserInitPath, deepForceUpdatePath, ...compiler.getImportsWithoutTypes(file), ]
  imports = imports.map(tourl)
  let [ _browserInitPath, deepForceUpdate, ...imports_arr ] = imports
return `
`
}