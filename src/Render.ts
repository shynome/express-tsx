
import configExtend = require('config-extend')

export type ssrRender = (render:any,data:Object)=>string
export type ssrWrap = (body:string,file:string,data:any)=>string
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

export function Render(options?:Options){
  let { ssr, ssrRender, ssrWrap, placeholder  }:Options = 
      configExtend({},defaultOptions,options,)
  return function render(file:string,data:Object,send:(error:Error,body:string,)=>void){
    let err:Error = null
    let body:string = placeholder
    try{
      if(ssr){
        let exports = require(file)
        let render = exports && exports.View || exports.default || exports
        body = ssrRender( render, data, )
      }
      body = ssrWrap( body, file, data, )
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