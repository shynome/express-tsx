import { Router,Response } from "express";
export const middleware = Router()
export const expressTsxMiddleware = middleware //alias name
export let preload = (res:Response,preload_imports:string[])=>res.setHeader('link',preload_imports.map(path=>`<${path}>; rel=preload; as=script`).join(','))
//express-tsx compiler handler
export const express_tsx_middleware_path = '/express-tsx/'
import { compiler } from "../Compile";
middleware.use(express_tsx_middleware_path,compiler.staticServer)
import { join } from "path";
middleware.use((req,res,next)=>{
  if(res.locals.express_tsx_basePath){ return next() }
  res.locals.express_tsx_basePath = join(req.baseUrl,express_tsx_middleware_path)
  next()
})