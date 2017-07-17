require('./ts')
const express = require('express')
const assert = require('assert')
const server = exports.server = express()
const express_tsx = require('../')
const createServer = new Promise((resolve,reject)=>{
  server.listen(function(){
    let port = this.address().port
    resolve(port)
  })
}).then(port=>`http://127.0.0.1:${port}`)
const renderFile = './views/index.tsx'
//default
const render1 = express()
render1.engine('.tsx',express_tsx.render)
render1.set('views',__dirname)
render1.set('view engine','tsx')
render1.use('/',(req,res)=>res.render(renderFile))
//replace html
const render2 = express()
render2.use((req,res,next)=>{
  res.locals.express_tsx_html = require('./html').html
  next()
})
render2.engine('.tsx',express_tsx.render)
render2.set('views',__dirname)
render2.set('view engine','tsx')
render2.use('/',(req,res)=>res.render(renderFile))
//server
server.use(express_tsx.middleware)
server.use('/render1',render1)
server.use('/render2',render2)
server.use( /\/$/,(req,res)=>res.sendfile((__dirname+'/render.html')))
const serverKeep = new Promise((resolve,reject)=>{
  server.use('/resolve',(req,res)=>{
    let info = `everything is ok`
    res.send(info)
    resolve(info)
  })
  server.use('/reject',(req,res)=>{
    let info = `browser render has error, please check html function`
    res.send(info)
    reject(info)
  })
})
const request = require('request-promise')
describe('render test',()=>{
  it('render view check by human',async()=>{
    let host = await createServer
    let [ res1 ,res2 ] = await Promise.all(
      ['/render1','/render2'].map(path=>host+path).map(path=>request(path))
    )
    assert(
      res1 !== res2,
      `res1 shound be diffrence between render1 and render2`
    )
    require('open')(host)
    console.log(`open ${host} in browser for check , if has error click resolve else click reject`)
    await serverKeep
  })
})