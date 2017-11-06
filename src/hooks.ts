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
    if(res.locals.express_tsx_basePath){ return next() }
    res.locals.express_tsx_basePath = path.join(req.baseUrl,Vars.express_tsx_path).replace(/\\/g,'/')
    res.locals.express_tsx_hotreload_path = path.join(req.baseUrl,Vars.express_tsx_hotreload_path).replace(/\\/g,'/')
    next()
  })
  //hot reload
  app.use(Vars.express_tsx_hotreload_path,function(req,res){
    const compiler:Compile = req.app.get(key.compiler)
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
  return app
}
