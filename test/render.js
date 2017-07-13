require('./ts')
const express = require('express')
const server = exports.server = express()
const createServer = new Promise((resolve,reject)=>{
  server.listen(8000,function(){
    let port = this.address().port
    resolve(port)
  })
})
const { middleware, render } = require('../src')
server.use(middleware)
server.engine('.tsx',render)
server.set('views',__dirname)
server.set('view engine','tsx')
server.use('/',(req,res)=>res.render('./views/index.tsx',{ hello:'string' }))

describe('render test',()=>{
  it('render view',async()=>{
    let port = await createServer
    await new Promise(rl=>0)
  })
})