import { Router,Response,Request } from "express";
import { ServerResponse, } from "spdy";
export const middleware = Router()
import { compile } from "./Compile";
import configExtend = require('config-extend')
declare module 'http' {
  interface ServerResponse {
    res:ServerResponse & Response
    req:Request
  }
}
export let extname_use_express_tsx = ['.tsx']
middleware.use(function(req,res,next){
  res.locals.res = res
  res.locals.req = req
  next()
})
export const basePath = '/express-tsx'
export let maxAge = 60*60*12
import { etag } from "./push";
import { parse } from "url";
middleware.use(basePath,function(req,res){
  res.type('js')
  res.setHeader('cache-control','max-age='+maxAge)
  let module = decodeURI(parse(req.url).pathname).slice(1)
      module = module.replace(/\.(js|tsx|ts|jsx)$/,'')
  let moduleTry:string
  switch(true){
  default:
    res.status(404).end(`Not found`)
    break
  case Reflect.has(compile.files,moduleTry=module):
  case Reflect.has(compile.files,moduleTry=module+'.tsx'):
  case Reflect.has(compile.files,moduleTry=module+'.ts'):
  case Reflect.has(compile.files,moduleTry=module+'.jsx'):
  case Reflect.has(compile.files,moduleTry=module+'.js'):
    let tag = etag(moduleTry)
    if( tag === req.header('if-none-match') ){
      res.status(304)
      res.end()
    }else{
      res.setHeader('ETag',tag)
      res.send(compile.compile(moduleTry).outputFiles[0].text)
    }
    break
  }
})