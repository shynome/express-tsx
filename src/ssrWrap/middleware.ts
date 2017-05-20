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
middleware.use(function(req,res,next){
  let originRender = res.render
  res.locals.req = req
  res.locals.res = res
  res.render = function(file:string,data={},){
    if(req.query.callback === 'define'){
      res.jsonp(data)
    }else{
      originRender.apply(this,arguments)
    }
    return this
  }
  next()
})
export const basePath = '/express-tsx'
middleware.use(basePath,function(req,res){
  res.type('js')
  let module = req.param('filename','')
      module = module.replace(/\.js$/,'')
  let moduleTry:string
  switch(true){
  default:
    res.status(404).end(`Not found`)
    break
  case Reflect.has(compile.files,moduleTry=module):
  case Reflect.has(compile.files,moduleTry=module+'.tsx'):
  case Reflect.has(compile.files,moduleTry=module+'.ts'):
    res.send(compile.compile(moduleTry).outputFiles[0].text)
    break
  }
})