import { Compile, key, Vars } from ".";
import { RequestHandler } from "express";
import { renderData, AddBaseUrl } from "./render";
//hot reload
export const hotreload:RequestHandler = (req,res)=>{
  let { compiler, baseUrl } = res.app.locals as renderData
  res.setHeader('Content-Type','text/event-stream')
  const renderFile:string = Compile.normalize(req.param('renderFile',''))
  let imports:string[] = renderFile ? compiler.getImportsWithoutTypes(renderFile) : null
  res.write([
    'event: ping',
    'data: ping',
    '\n',//separator
  ].join('\n'))
  const express_tsx_basePath = AddBaseUrl(baseUrl)(Vars.express_tsx_path)
  const imports2url = compiler.tourl(express_tsx_basePath)
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
}