import *as React from 'react';
(global as any).React = React
declare global {
  var React:any
}
import *as ReactDOM from 'react-dom/server';
export type option = {
  /**模板热更新 */
  hotload?:boolean
  /**默认不保留 react 标记 */
  renderMethod?:'renderToString'|'renderToStaticMarkup'
}
export let render = ({ renderMethod='renderToStaticMarkup', hotload=false, }:option = {})=>
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