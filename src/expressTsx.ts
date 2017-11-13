import express = require('express')
import { render, Compile, key, Vars, } from ".";
import { addHooks } from "./hooks";
import path = require('path')
import { bindRequirejsConfig } from "./require.config";
import { hotreload } from "./hotreload";
export let cursor = 0
export const expressTsx = (viewsDir?:string,app=express())=>{
  app.engine('.tsx',render)
  typeof viewsDir==='string' && app.set('views',viewsDir)
  app.set('view engine','tsx')
  //set render data
  app.use((req,res,next)=>{
    res.locals.baseUrl = req.baseUrl
    next()
  })
  app.locals.cache = true
  app.locals[key.compilerId] = `compiler${cursor++}`
  const compiler = app.locals[key.compiler] = new Compile()
  app.use(Vars.express_tsx_path,compiler.staticServer)
  app.use(Vars.express_tsx_hotreload_path,hotreload)
  bindRequirejsConfig(app)
  return app
}