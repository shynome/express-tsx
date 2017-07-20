import express = require('express')
import { middleware,render } from "../";
export const expressTsx = (viewsDir?:string,app=express(),)=>{
  app.engine('.tsx',render)
  typeof viewsDir==='string' && app.set('views',viewsDir)
  app.set('view engine','tsx')
  return app
}