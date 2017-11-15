import express = require('express')
import { render, Compile, key, Vars, } from ".";
import { addHooks } from "./hooks";
import path = require('path')
import { bindRequirejsConfig } from "./require.config";
import { hotreload } from "./hotreload";
import { HtmlData } from "./render";
export const defaultHtmlData = new HtmlData()
export let cursor = 0
export const AddBaseUrl = (baseUrl:string,url:string)=>path.join(baseUrl,url).replace(/\\/g,'/')
export const expressTsx = (viewsDir?:string,app=express())=>{
  app.engine('.tsx',render)
  typeof viewsDir==='string' && app.set('views',viewsDir)
  app.set('view engine','tsx')
  Object.assign(app.locals,defaultHtmlData)
  //set render data
  app.use((req,res,next)=>{
    app.settings.baseUrl = req.baseUrl
    next()
  })
  const dev = !/production/i.test(app.get('env'))
  app.locals.cache = !dev
  app.settings.hotreload = dev
  app.settings[key.compilerId] = `compiler${cursor++}`
  app.settings[key.compiler] = new Compile(viewsDir)
  app.use(Vars.express_tsx_path,app.settings[key.compiler].staticServer)
  Object.defineProperty(
    app.settings, 'express_tsx_path',
    { get(){ return AddBaseUrl(this.baseUrl,Vars.express_tsx_path) } }
  )
  app.use(Vars.express_tsx_hotreload_path,hotreload)
  Object.defineProperty(
    app.settings, 'express_tsx_hotreload_path',
    { get(){ return AddBaseUrl(this.baseUrl,Vars.express_tsx_hotreload_path) } }
  )
  bindRequirejsConfig(app)
  return app
}