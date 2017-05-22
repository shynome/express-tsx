import { Router,Response,Request } from "express";
import { ServerResponse, } from "spdy";
export const middleware = Router()
import { compile } from "./Compile";
import configExtend = require('config-extend')
export class config {
  constructor(data:config){
    configExtend(this,data)
  }
  //pre set
  req:Request
  res:Response & ServerResponse
  //placeholder
  title = 'express-tsx'
  lang = 'en'
  imports:string[]
  baseUrl:string
  //don't need show
  _locals:any
}
declare module 'http' {
  interface ServerResponse {
    ViewData:{[key:string]:any}
  }
}
middleware.use(function(req,res,next){
  let originRender = res.render
  res.locals.req = req
  res.locals.res = res
  res.render = function(file:string,data={},){
    if(req.query.callback === 'define'){
      res.jsonp(data)
    }else{
      res.ViewData = Object.assign({},data)
      originRender.apply(this,arguments)
    }
    return this
  }
  next()
})
export const basePath = '/express-tsx'
export const MaxAge = 60*60*12
import { etag } from "./push";
import { parse } from "url";
middleware.use(basePath,function(req,res){
  res.type('js')
  res.setHeader('cache-control','max-age='+MaxAge)
  let module = parse(req.url).pathname.slice(1)
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