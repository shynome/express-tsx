import { Router,Response } from "express";
export const middleware = Router()
//alias name
export const expressTsxMiddleware = middleware
//express-tsx compiler handler
export const express_tsx_middleware_path = '/express-tsx/'
import { compiler } from "../Compile";
middleware.use(express_tsx_middleware_path,compiler.staticServer)
//server data setting
import { ViewData,data } from "./render";
import { Compile } from "../Compile";
import { html } from './html'
export class ServerData {
  //express-tsx addon
  callback:string|undefined = null
  res:Response = null
  express_tsx_basePath:string = null
  express_tsx_compiler:Compile = null  
  express_tsx_html:html = html
  //express server data
  _locals:object = null
  cache:boolean = null
  settings:object = null
  requirejsConfigPath:string = null
  renderjsPath:string = null
  static need_delete_fields = Object.keys(new ServerData())
  static filter = (data:data):ViewData=>{
    let filtered_data:any = {}
    for(let key in data){
      if(ServerData.need_delete_fields.includes(key)){ continue }
      filtered_data[key] = data[key]
    }
    return filtered_data
  }
}
import { sys } from "typescript";
middleware.use((req,res,next)=>{
  if(res.locals.express_tsx_basePath){ return next() }
  res.locals.express_tsx_basePath = sys.resolvePath(req.baseUrl+express_tsx_middleware_path)
  res.locals.express_tsx_compiler = compiler
  res.locals.express_tsx_html = html
  res.locals.callback = req.query.callback
  res.locals.res = res
  next()
})