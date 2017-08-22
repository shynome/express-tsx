import { Router,Response } from "express";
export const middleware = Router()
export const expressTsxMiddleware = middleware //alias name
export let preload = (res:Response,preload_imports:string[])=>res.setHeader('link',preload_imports.map(path=>`<${path}>; rel=preload; as=script`).join(','))
import { Compile } from "../Compile";
export const compiler = new Compile()
//express-tsx compiler handler
export const express_tsx_middleware_path = '/express-tsx/'
middleware.use(express_tsx_middleware_path,compiler.staticServer)
import { join } from "path";
middleware.use((req,res,next)=>{
  if(res.locals.express_tsx_basePath){ return next() }
  res.locals.express_tsx_basePath = join(req.baseUrl,express_tsx_middleware_path).replace(/\\/g,'/')
  res.locals.express_tsx_hotreload_path = join(req.baseUrl,express_tsx_hotreload_path).replace(/\\/g,'/')
  next()
})
//hot reload
export const express_tsx_hotreload_path = '/express-tsx-hotreload/'
middleware.use(express_tsx_hotreload_path,function(req,res){
  res.setHeader('Content-Type','text/event-stream')
  const renderFile:string = Compile.normalize(req.param('renderFile',''))
  let imports:string[] = renderFile ? compiler.getImportsWithoutTypes(renderFile) : null
  res.write([
    'event: ping',
    'data: ping',
    '\n',//separator
  ].join('\n'))
  const imports2url = compiler.tourl(res.locals.express_tsx_basePath)
  let listener = (file:string)=>{
    file = Compile.normalize(file)
    if( imports && !imports.includes(file) ){ // if you not set the render file, you will get the uncorrelated hotreload event
      // if imports of the render file not include the file, not trigger hotreload event 
      return
    }
    imports = compiler.getImportsWithoutTypes(file) //may the imports has changed, so we need update it
    let importsUrl = imports.map(imports2url) //compile new import file
    res.write([
      'event: hotreload',
      `data: ${JSON.stringify(importsUrl)}`,
      '\n',//separator
    ].join('\n'))
  }
  let removeListener = ()=>compiler.watcher.removeListener('update',listener)
  compiler.watcher.on('update',listener)
  res.on('close',removeListener)
})