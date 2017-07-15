import { Router,Response } from "express";
export const middleware = Router()

export const express_tsx_middleware_path = '/express-tsx/'
import { compiler } from "../Compile";
middleware.use(express_tsx_middleware_path,compiler.staticServer)

import { ViewData,data } from "./render";
export class ServerData {
  //express-tsx addon
  callback:string|undefined = null
  res:Response = null
  express_tsx_basePath:string = null
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
import { Compile } from "../Compile";
declare global {
  namespace Express {
    export interface Application {
      compiler:Compile
    }
  }
}
import { sys } from "typescript";
middleware.use((req,res,next)=>{
  if(res.locals.express_tsx_basePath){ return next() }
  res.locals.express_tsx_basePath = sys.resolvePath(req.baseUrl+express_tsx_middleware_path)
  res.locals.callback = req.query.callback
  res.locals.res = res
  res.app.compiler = compiler;
  next()
})