import ts = require('typescript')
import Url = require('url')
import { RequestHandler } from "express";
import { sys } from 'typescript'
export type Import = {
  module:string
  filename:string
}
import glob = require('glob')
export class Compile {
  server:ts.LanguageService
  compilerOptions:ts.CompilerOptions = {}
  static defaultCompilerOptions:ts.CompilerOptions = {
    target: ts.ScriptTarget.ES5,
    module:ts.ModuleKind.AMD,
    moduleResolution:ts.ModuleResolutionKind.NodeJs,
  }
  project:string = sys.getCurrentDirectory()
  hash:{[filename:string]:string} = {}
  parseImports = (file,code:string):string[]=>{
    let imports:string[] = []
    imports = ts.preProcessFile(code).importedFiles.map(({ fileName })=>fileName )
    .map(
      (module)=>{
        let resolvedModule = ts.resolveModuleName(module,file,this.compilerOptions,sys).resolvedModule
        return resolvedModule && resolvedModule.resolvedFileName
      }
    )
    .filter(v=>v)
    .filter(file=>!Reflect.has(this.hash,file))
    imports.forEach(this.updateScriptVersion)
    return imports
  }
  updateScriptVersion = (file)=>{
    let code = sys.readFile(file)
    let md5 = this.hash[file] = sys.createHash(code)
    this.parseImports(file,code)
    return md5
  }
  getScriptVersion = (file)=>{
    file = sys.resolvePath(file)
    let md5:string = this.hash[file]
    if(!md5){
      md5 = this.updateScriptVersion(file)
    }
    return md5
  }
  init = (compilerOptions:ts.CompilerOptions)=>{
    if(typeof compilerOptions.project==='string'){
      this.project = compilerOptions.project
    }
    try{
      let { config, error } = ts.readConfigFile(this.project+'/tsconfig.json',ts.sys.readFile)
      if(error){ throw error }
      let { options, errors } = ts.convertCompilerOptionsFromJson(config.compilerOptions,this.project)
      if((errors.length)){ throw errors }
      this.compilerOptions = options
    }catch(err){
      console.warn(err)
    }
    this.compilerOptions = { ...this.compilerOptions, ...Compile.defaultCompilerOptions, ...compilerOptions, }
  }
  constructor(compilerOptions:ts.CompilerOptions={}){
    this.init(compilerOptions)
    this.server = ts.createLanguageService({
      getCompilationSettings:()=>this.compilerOptions,
      getScriptFileNames:()=>Object.keys(this.hash),
      getScriptVersion:(file)=>this.getScriptVersion(file),
      getScriptSnapshot:(file)=>sys.fileExists(file) ? ts.ScriptSnapshot.fromString(sys.readFile(file)) : undefined,
      getCurrentDirectory:()=>this.project,
      getDefaultLibFileName:(options)=>ts.getDefaultLibFileName(options),
    })
  }
  getFileImports = (file,program=this.server.getProgram())=>{
    let source = program.getSourceFile(file) as any
    let resolvedModules:string[] = []
    if(!source.resolvedModules){
      return resolvedModules
    }
    resolvedModules = Array.from((source.resolvedModules as Map<any,{resolvedFileName:string}>).values()).map(({resolvedFileName})=>resolvedFileName)
    return resolvedModules
  }
  getImports = (file:string,imports = [file],program=this.server.getProgram()):string[]=>{
    let newImports = [file].concat(this.getFileImports(file,program)).filter(m=>!imports.includes(m))
    return !newImports.length
      ? imports
      : newImports.reduce((all,p)=>this.getImports(p,all,program),imports.concat(newImports))
  }
  static ignore = /node_modules/
  getImportsWithoutTypes = (file:string)=>this.getImports(file).filter((file)=>!Compile.ignore.test(file))
  getEmitOutput = (file)=>this.server.getEmitOutput(file)
  getSourceCode = (file)=>this.server.getProgram().getSourceFile(file).text
  getCompiledCode = (file)=>{
    let outputFiles = this.getEmitOutput(file).outputFiles.slice(0,2)
    return outputFiles.slice(-1)[0].text
  }
  getSourceMap = (file)=>{
    let outputFiles = this.getEmitOutput(file).outputFiles.slice(0,2)
    if(outputFiles.length===1){
      return 'no sourceMap'//false
    }
    return outputFiles.slice(0,1)[0].text
  }
  static regx = {
    sourceMap:/\.js\.map$/,
    replace:/\.(ts(x|)|js(x|))$/
  }
  pathMapToFile = (module:string,tryExts:string[]=['tsx','ts','jsx','js','']):string|undefined=>{
    let file:string
    if( !tryExts[0] ){ return undefined }
    return Reflect.has(this.hash,file=module+'.'+tryExts[0])
      ? file
      : this.pathMapToFile(module,tryExts.slice(1))
  }
  jsExpiredTime:number =15*1*24*60*60
  staticServer:RequestHandler = async(req,res)=>{
    let url = Url.parse(req.originalUrl)
    let regx = Compile.regx
    let { pathname, query={} } = url
    let path:string = pathname.slice(req.baseUrl.length+1)
    let isRequestSourceMap = regx.sourceMap.test(path)
    if( isRequestSourceMap ){ path = path.replace(regx.sourceMap,'') }
    let module = path.replace(Compile.regx.replace,'')
    let file:string
    if( !(file = this.pathMapToFile(module)) ){ return res.status(404).end(`not found`) }
    let body:string = ''
    switch(true){
      case isRequestSourceMap:
        res.type('.json')
        body = this.getSourceMap(file)
        break
      case typeof req.query.v === 'string':
        res.type('.js').setHeader('Cache-Control',`max-age=${this.jsExpiredTime}`)
        body = this.getCompiledCode(file)
        break
      default:
        res.type('.js')
        body = this.getSourceCode(file)
        break
    }
    res.send(body)
  }
}