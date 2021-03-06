import { Express, Router,Response, static as staticServer } from "express";
import { Vars, key, Compile } from ".";
import path = require('path')
export let preload = (res:Response,preload_imports:string[])=>res.setHeader('link',preload_imports.map(path=>`<${path}>; rel=preload; as=script`).join(','))
export const middleware = Router()
export const expressTsxMiddleware = middleware //alias name
export const compiler = new Compile()
//node_modules static server
compiler.development && middleware.use(
  Vars.node_modules,
  staticServer(
    path.resolve('.'+Vars.node_modules),
    { maxAge:15*24*60*60 }
  )
)
export const addHooks = (app:Express)=>{
  const compiler = app.get(key.compiler)
  //express-tsx compiler handler
  app.use(Vars.express_tsx_path,compiler.staticServer)
  //inject data
  app.use((req,res,next)=>{
    if(res.locals.app){ return next() }
    res.locals.baseUrl = req.baseUrl
    res.locals.express_tsx_basePath = path.join(req.baseUrl,Vars.express_tsx_path).replace(/\\/g,'/')
    res.locals.express_tsx_hotreload_path = path.join(req.baseUrl,Vars.express_tsx_hotreload_path).replace(/\\/g,'/')
    next()
  })
  return app
}
