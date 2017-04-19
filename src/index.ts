import React = require('react');
(global as any).React = React
declare global {
  var React:any
}
import ReactDOM = require('react-dom/server');
export class Options {
  /**模板热更新 */
  hotload?:boolean = false
  /**服务器渲染函数 */
  renderMethod?:'renderToString'|'renderToStaticMarkup' = 'renderToString'
  /**文档类型 */
  doctype?:string = '<!DOCTYPE html>'
}
/**默认配置 */
export let defaultOptions:Options = new Options()
import configExtend = require("config-extend")
export function render(options:Options=defaultOptions){
  const { renderMethod, hotload, doctype }:Options = configExtend({},defaultOptions,options)
  return function(filepath:string, data:any, cb){
        filepath = require.resolve(filepath)
    if( hotload ){
      delete require.cache[filepath] //粗暴地实现了热载
    }
    let exports = require(filepath)
    let Render = exports && exports.default || exports
    let jsx = React.createElement(Render,data)
    let html:string = doctype
        html += ReactDOM[renderMethod](jsx)
    cb(null,html)
  }
}
export let __express = render
export default render