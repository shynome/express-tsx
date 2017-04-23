import React = require('react');
(global as any).React = React
declare global { var React:any }
import path = require('path')
import ReactDOM = require('react-dom/server');
import ts = require('typescript')

import { Compile } from "./Compile";
export class Options {
  /**模板热更新 */
  hotload?:boolean = false
  /**文档类型 */
  doctype?:string = '<!DOCTYPE html>'
  /**服务器同构渲染 */
  ssr?:boolean = false
  /**编译函数 */
  compile? = new Compile().compile
  ssrRender ?= async(Render,data,filepath:string,compile:(filepath:string)=>(Promise<string>|string))=>{
    let app = React.createElement(Render,data)
    let appModuleName = path.basename(filepath,path.extname(filepath))
    let appDefineScript = `<script>${await compile(filepath)}</script>`
    return WrapApp(ReactDOM.renderToString(app),data,[
      appDefineScript,
      BowserRender(appModuleName,data),
    ])
  }
}
/**默认配置 */
export let defaultOptions:Options = new Options()
import configExtend = require("config-extend")

import { BowserRender, WrapApp } from './App'

export function render(options:Options=defaultOptions){
  const { hotload, doctype, ssr, compile, ssrRender }:Options = configExtend({},defaultOptions,options)
  return async function(filepath:string, data:any, cb){
        filepath = require.resolve(filepath)
    if( hotload ){
      delete require.cache[filepath] //粗暴地实现了热载
    }
    let exports = require(filepath)
    let Render = exports && exports.default || exports
    let html:string = doctype
    if(ssr){
      html += await ssrRender(Render,data,filepath,compile)
    }else{
      html += ReactDOM.renderToStaticMarkup(
        React.createElement(Render,data)
      )
    }
    cb(null,html)
  }
}
export let __express = render
export default render