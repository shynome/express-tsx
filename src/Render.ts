
import configExtend = require('config-extend')

import { Response,Request } from 'express'
import { ServerResponse } from "spdy";
export type ssrRender = (render:any,data:Object)=>string
export type ssrWrap = (body:string,ViewData:config,file:string,data:config)=>string
import { wrap as _ssrWrap } from "./ssrWrap";
export class Options {
  constructor(options?:Options){
    configExtend(this,options)
  }
  /**
   * 开启的话将会在服务器同构渲染     
   * 默认调用的是 ReactDOM.renderToString 方法    
   * 可以传入一个 ssrRender 方法替代默认渲染方式    
   */
  ssr?:boolean = false
  ssrRender?:ssrRender 
    = (render,data)=>require('react-dom/server').renderToString( require('react').createElement(render,data) )
  ssrWrap?:ssrWrap = _ssrWrap
  placeholder?:string = ''
}
export let defaultOptions = new Options()
export let filterKeys = ['_locals','settings','cache','req','res']
export let getViewData = (data:Object)=>
Object.keys(data).filter(key=>filterKeys.indexOf(key)===-1)
.reduce((target,key)=>(target[key]=data[key],target),{})
export class config {
  constructor(data:config){
    configExtend(this,data)
  }
  title = 'express-tsx'
  lang = 'en'
  callback = 'define'
  req:Request
  res:Response & ServerResponse
}

export function Render(options?:Options){
  let { ssr, ssrRender, ssrWrap, placeholder  }:Options = 
      configExtend({},defaultOptions,options,)
  return function render(file:string,data:config,send:(error:Error,body:string,)=>void){
    let err:Error = null
    let body:string = placeholder
    let req = data.req
    let res = data.res
    try{
      let ViewData:any = getViewData(data)
      let callback = req.query.callback
      switch(true){
      case typeof callback === 'string':
        body = JSON.stringify(ViewData)
        if(callback.length){
          res.type('js')
          body = `typeof ${callback} === 'function' && ${callback}(${body})`
        }else{
          res.type('json')
        }
        break
      default:
        if(ssr){
          let exports = require(file)
          let render = exports && exports.View || exports.default || exports
          body = ssrRender( render, ViewData, )
        }
        body = ssrWrap( body, ViewData, file, data )
        break
      }
    }
    catch(e){
      err = e
    }
    finally{
      send(err,body)
    }
  }
}
export let render = Render