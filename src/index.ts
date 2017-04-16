import *as React from 'react';
(global as any).React = React
declare global {
  var React:any
}
import *as ReactDOM from 'react-dom/server';
export class Option {
  /**模板热更新 */
  hotload?:boolean = false
  /**服务器渲染函数 */
  renderMethod?:'renderToString'|'renderToStaticMarkup' = 'renderToString'
}
/**默认配置 */
export let defaultOption:Option = new Option()
import *as configExtend from "config-extend";
export let render = (option:Option=defaultOption)=>{
  const { renderMethod, hotload }:Option = configExtend({},defaultOption,option)
  return (filepath:string,options:any,cb)=>{
        filepath = require.resolve(filepath)
    if( hotload ){
      delete require.cache[filepath] //粗暴地实现了热载
    }
    let exports = require(filepath)
    let Render = exports && exports.default || exports
    let jsx = React.createElement(Render,options)
    let html = ReactDOM[renderMethod](jsx)
    cb(null,html)
  }
}
export let __express = render
export default render