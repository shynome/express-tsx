import ts = require('typescript')
import path = require('path')
import fs = require('fs')
import crypto = require('crypto')
import configExtend = require('config-extend')
import { FSWatcher } from 'chokidar'

export let defaultCompilerOptions:ts.CompilerOptions = {
  module:ts.ModuleKind.AMD,
  target:ts.ScriptTarget.ES5,
  jsx:ts.JsxEmit.React,
  sourceMap:true,
}

export class Shot {
  constructor(file){
    this.filename = file
    this.version = Shot.getHash(file)
  }
  filename?:string
  version:string
  static getHash = (file)=>crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex')
  outputFile:string
  expired:boolean = true
  /**cache import files */
  imports?:string[]
}

export class Compile {
  static defaultCompilerOptions = defaultCompilerOptions
  compilerOptions:ts.CompilerOptions = {}
  outDir:string
  constructor(options?:ts.CompilerOptions,rootDir=process.cwd()){
    configExtend(this.compilerOptions,Compile.defaultCompilerOptions,options)
    this.service = ts.createLanguageService({
      getCompilationSettings:()=>this.compilerOptions,
      getScriptFileNames:()=>Object.keys(this.scriptVersion),
      getScriptVersion:this.getScriptVersion,
      getScriptSnapshot:(file)=>!fs.existsSync(file)?undefined:ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString()),
      getCurrentDirectory:()=>rootDir,
      getDefaultLibFileName:(options)=>ts.getDefaultLibFilePath(options)
    })
    if(
      !/production/i.test(process.env.NODE_ENV) //only watch on dev
    ){
      this.FSWatch = require('chokidar').watch(rootDir,{ ignored:/\.git/ })
        .on('change',this.updateFilesShot)
    }
  }
  FSWatch:FSWatcher
  updateFilesShot = (file)=>{
    file = Compile.normalize(file)
    if(!Reflect.has(this.scriptVersion,file)){
      return
    }
    let shot = this.scriptVersion[file]
    shot.version = Shot.getHash(file)
    shot.expired = true
  }
  service:ts.LanguageService
  static normalize = (f:string)=>{
    f = f.replace(/\\/g,'/')
    //One Drive letter has two cases ( E: or e:)
    let path = f.split(':')
    if(path.length>1){
      path[0] = path[0].toLowerCase()
    }
    f = path.join(':')
    return f
  }
  getScriptVersion = (file:string)=>this.scriptVersion[file].version
  filesVersion = {}
  scriptVersion = new Proxy<{[key:string]:Shot}>(this.filesVersion,{
    get:(target,filename:string)=>{
      filename = Compile.normalize(filename) //路径标准化
      if(!target[filename]){
        target[filename] = new Shot(filename)
      }
      return target[filename]
    },
  })
  getAllImports = (file:string,imports=[]):string[]=>{
    let newImports = [file].concat(this.getOneFileImports(file)).filter(m=>imports.indexOf(m)===-1)
    return !newImports.length
      ? imports
      : newImports.reduce((t,p)=>this.getAllImports(p,t),imports.concat(newImports))
  }
  getOneFileImports = (file:string)=>{
    let resolvedModules:any[] = (this.service.getProgram().getSourceFile(file) as any).resolvedModules // typescript 没有公开的属性
    return resolvedModules 
      ? Array.from(resolvedModules.values())
        .filter(a=>a) //filter void
        .map<string>((a:any)=>a.resolvedFileName) 
      : []
  }
  getImports = (file:string)=>this.getAllImports(this.scriptVersion[file].filename).filter(m=>!(/node_modules/.test(m)))
  compile = (filename:string)=>this.service.getEmitOutput(filename)
  getCompiledCode = (filename:string)=>this.compile(filename).outputFiles.slice(-1)[0]
  getSourceMap = (filename:string)=>this.compile(filename).outputFiles[0]
}
