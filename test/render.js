const express = require('express')
const assert = require('assert')
const server = exports.server = express()
const { expressTsx, expressTsxMiddleware } = require('../')
const createServer = new Promise((resolve,reject)=>{
  server.listen(function(){
    let port = this.address().port
    resolve(port)
  })
}).then(port=>`http://127.0.0.1:${port}`)
const renderFile = './views/index.tsx'
//default
const render1 = expressTsx(__dirname)
render1.use('/',(req,res)=>res.render(renderFile))
//replace html
const render2 = expressTsx(__dirname)
render2.use((req,res,next)=>{
  let originTsxHTML = res.locals.express_tsx_html
  res.locals.express_tsx_html = async(...r)=>{
    return (await originTsxHTML(...r)).replace(`<body>`,`<body>render by diy html function`)
  }
  next()
})
render2.use('/',(req,res)=>res.render(renderFile))
//server
server.use(expressTsxMiddleware)
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
let path = require('path')
describe('render test',()=>{
  it('requirejsConfig update',()=>{
    const { Compile, requirejsConfig } = require('../')
    const requirejsConfigPath = path.join(__dirname,'config.ts')
    let compiler = new Compile({},false)
    requirejsConfig({},compiler,requirejsConfigPath)
    let first_code = compiler.getCompiledCode(requirejsConfigPath)
    requirejsConfig({ paths:{ a:'b' } },compiler,requirejsConfigPath)
    let second_code = compiler.getCompiledCode(requirejsConfigPath)    
    assert(
      first_code !== second_code,
      `Two config codes should be diffrent`
    )
    //clear dist file
    require('fs').unlinkSync(requirejsConfigPath)
  })
  it('render view check by human',async()=>{
    let host = await createServer
    require('open')(host)
    console.log(`open ${host} in browser for check , if has error click resolve else click reject`)
    await serverKeep
  })
})