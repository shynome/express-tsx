//@ts-check
const assert = require('assert')
const path = require('path')
const fs = require('fs')

/**@type {function(any):Promise<string>} */
const startServer = exports.startServer = (_server)=>new Promise((rl,rj)=>{
  const Express = require('express')
  const server = Express().use(_server)
  server
  //@ts-ignore
  .once('error',rj)
  .listen(function(){
    let url = `http://127.0.0.1:${this.address().port}`
    rl(url)
  })
})
//change view
const tpl = (word)=>`
import React = require('react')
export default <div id="text">${word}</div>
`
const rewriteView = exports.rewriteView = (/**@type {string}*/viewFile)=>{
  viewFile = path.join(__dirname,viewFile)
  return (/**@type {string}*/word)=>{
    let newText = tpl(word)
    fs.writeFileSync(viewFile,newText)
    return newText
  }
}

describe('render test',()=>{
  require('./baseRender')
  require('./hotRender')
})
