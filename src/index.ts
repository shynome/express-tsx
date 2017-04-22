import React = require('react');
(global as any).React = React
declare global { var React:any }
import path = require('path')
import ReactDOM = require('react-dom/server');
import ts = require('typescript')

export class Options {
  /**模板热更新 */
  hotload?:boolean = false
  /**文档类型 */
  doctype?:string = '<!DOCTYPE html>'
  /**服务器同构渲染 */
  ssr?:boolean = false
  /**编译选项 */
  compilerOptions?:ts.CompilerOptions = {
    allowJs:true,
    module:ts.ModuleKind.AMD,
    target:ts.ScriptTarget.ES5,
    jsx:ts.JsxEmit.React,
    outFile:'bundle.js',
    inlineSourceMap:true,
    inlineSources:true,
  }
  ssrRender ?= async(Render,data,filepath:string,compile:(filepath:string)=>Promise<string>)=>{
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

export const getCompile = (compilerOptions:ts.CompilerOptions)=>(file:string):Promise<string>=>
new Promise((resolve,reject)=>{
  ts.createProgram([file],compilerOptions).emit(undefined,(outFile,outputText)=>{
    resolve(outputText)
  })
})

import { BowserRender, WrapApp } from './App'

export function render(options:Options=defaultOptions){
  const { hotload, doctype, ssr, compilerOptions, ssrRender }:Options = configExtend({},defaultOptions,options)
  let compile = getCompile(compilerOptions)
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