
import configExtend = require('config-extend')
import React = require('react')
import ReactDOM = require('react-dom/server')
import { Router } from "express";

import { compile as c,defaultOutDir } from "./Compile";
export * from './Compile'
import { ssrWrap } from "./ssrWrap";

export class Options {
  constructor(options?:Options){
    configExtend(this,options)
    this.renderToString = this.ssr?ReactDOM.renderToString:ReactDOM.renderToStaticMarkup
  }
  compile?:(file:string)=>any = c.compile
  renderToJSX?:(Render,data:Object)=>JSX.Element = React.createElement
  renderToString?:(jsx)=>string
  ssr?:boolean = false
  path?:string = defaultOutDir
  requirejs?:RequireConfig = {
    paths:{
      'react'     :'//cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react',
      'react-dom' :'//cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom',
    }
  }
  ssrWrap?:(body:string,Render:string,data:Object,requirejs:RequireConfig)=>string = ssrWrap
}

export let middleware = Router()
import { relative } from "path";
middleware.use((req,res,next)=>{
  res.locals.baseUrl = relative(req.url,'/').replace(/\\/g,'/')
  next()
})

import { join } from 'path'
export function render(options?:Options){
  let { renderToJSX,renderToString,ssrWrap,compile,path,requirejs,ssr } = new Options(options)
  if(path){
    path = join('/',path).replace(/\\/g,'/')
    middleware.use(path,c.middleware)
  }
  return (file:string,data:Object&{baseUrl:string},send)=>{
    try{
      let exports = ((file)=>require(file))(file)
      let Render = exports && exports.default || exports
      let body = renderToString( renderToJSX(Render,data) )
      if(ssr){
        let scriptUrl = join(data.baseUrl,path,compile(file)).replace(/\\/g,'/')
        body = ssrWrap(body,scriptUrl,data,requirejs)
      }
      send(null,body)
    }catch(err){
      send(err)
    }
  }
}
