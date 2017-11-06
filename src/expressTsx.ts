import express = require('express')
import { middleware,render, Compile, key } from ".";
import { requirejsConfig } from "./require.config";
import { addHooks } from "./hooks";
export const expressTsx = (viewsDir?:string,app=express(),)=>{
  app.engine('.tsx',render)
  typeof viewsDir==='string' && app.set('views',viewsDir)
  app.set('view engine','tsx')
  app.set(key.compiler, new Compile())
  requirejsConfig(app)() //定义了 `/require.config.js` 路由, 用以获取 require.config
  addHooks(app) //添加一些自定义路由
  return app
}