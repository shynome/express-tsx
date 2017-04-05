import *as React from 'react';
(global as any).React = React
declare global {
  var React:any
}
import *as ReactDOM from 'react-dom/server';
export type option = {
  /**模板热更新 */
  hotload?:boolean
  /**服务器渲染函数 */
  renderMethod?:'renderToString'|'renderToStaticMarkup'
}
/**默认配置 */
export let option:option = {
  hotload : false,
  renderMethod : 'renderToStaticMarkup'
}
export let render = ({ renderMethod=option.renderMethod, hotload=option.hotload, }:option = {})=>
(filepath:string,options:any,cb)=>{
      filepath = require.resolve(filepath)
  if( hotload ){
    delete require.cache[filepath]
  }
  let exports = require(filepath)
  let Render = exports && exports.default || exports
  let jsx = React.createElement(Render,options)
  let html = ReactDOM[renderMethod](jsx)
  cb(null,html)
}
export let __express = render
export default render