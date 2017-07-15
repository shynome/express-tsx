import { ServerData } from "./middleware";
export class ViewData {
  constructor(view_data:any = {} ) { Object.assign(this,ServerData.filter(view_data)) }
  [key: string]: any
  title:string = 'express-tsx'
  lang:string = 'en'
}
export type data = ServerData & ViewData

export type ViewEngine = (file:string,data:data,next:(error:Error|null,rendered?:string)=>void)=>void
import { sys } from "typescript";
import { html } from './'
/**
 * you can rewrite html wrap function for your application .
 */
export const render:ViewEngine = async(file,data,next)=>(async(file,data):Promise<string>=>{
  let callback = data.callback
  let view_data = new ViewData(data)
  if(typeof callback === 'string'){
    let json = JSON.stringify(view_data)
    if( !callback.length ){ return json }
    return `${callback}(${json})`
  }
  file = sys.resolvePath(file)
  return html(file,data,view_data)
})(file,data).then(
  (res)=>next(null,res),
  (err)=>next(err),
)
