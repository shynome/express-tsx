import Express = require('express')
import { server, getLocalUrl } from ".";
import { expressTsx } from "..";
import { Chromeless } from 'chromeless'
describe('render',()=>{
  it('base',async()=>{
    let baseurl = await getLocalUrl
    const app = expressTsx(__dirname)
    app.locals.cache = true
    const url = '/render.base'
    server.use(url,app)
    app.get('/',(req,res)=>res.render('./view.tsx'))
    // const chromeless = new Chromeless() 
    // const loadUrl = baseurl+url
    // console.log(loadUrl)
    await new Promise(rl=>setTimeout(rl,24*60*60*1e3))
    // let a = await chromeless.goto(loadUrl).wait('body').
  })
})