import Express = require('express')
export const server = Express()
export const getPort:Promise<number> = new Promise((rl,rj)=>{
  server.listen(300,function(){
    rl(this.address().port)
  }).once('error',rj)
})
describe('x',()=>{
  console.log(555)
  it('x',()=>{})
})