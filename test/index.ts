process.chdir(__dirname)
import Express = require('express')
export const server = Express()
export const getLocalUrl:Promise<string> = new Promise((rl,rj)=>{
  server.listen(3000,function(){
    rl(`http://localhost:${this.address().port}`)
  }).once('error',rj)
})
require('./render')