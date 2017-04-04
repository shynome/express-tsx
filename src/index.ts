import *as React from 'react';
(global as any).React = React
declare global {
  var React:any
}
import { renderToString } from 'react-dom/server';

export let render = (filepath:string,options:any,cb)=>{
  let exports = require(filepath)
  let Render = exports && exports.default || exports
  let jsx = React.createElement(Render,options)
  let html = renderToString(jsx)
  cb(null,html)
}
export let __express = render
export default render