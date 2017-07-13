
import { Router,Response } from "express";
export const renderMiddleware = Router()
renderMiddleware.use((req,res,next)=>{
  res.locals.callback = req.query.callback
  res.locals.res = res
  next()
})
import { compiler,Compile } from "./Compile";
declare global {
  namespace Express {
    export interface Application {
      compiler:Compile
    }
  }
}
renderMiddleware.use((req,res,next)=>{
  res.app.compiler = compiler
  next()
})
export class ServerData {
  //express-tsx addon
  callback:string|undefined = null
  res:Response = null
  //express server data
  _locals:object = null
  cache:boolean = null
  settings:object = null
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
export type ViewData = {
  title:string
  lang:string
  [key:string]:any
}
export type data = ServerData & ViewData

export type ViewEngine = (file:string,data:data,next:(error:Error|null,rendered?:string)=>void)=>void
import { html } from './html'
export const render:ViewEngine = async(file,data,next)=>(async(file,data):Promise<string>=>{
  let callback = data.callback
  let view_data = ServerData.filter(data)
  if(typeof callback === 'string'){
    let json = JSON.stringify(view_data)
    if( !callback.length ){ return json }
    return `${callback}(${json})`
  }
  let compiler = data.res.app.compiler
  compiler.getScriptVersion(file)
  let imports = compiler.getImportsWithoutTypes(file)
      imports = imports.map((module)=>module+'?v='+compiler.getScriptVersion(module))
      
  return html(file,data,imports)
})(file,data).then(
  (res)=>next(null,res),
  (err)=>next(err),
)
