import ts = require('typescript')
import path = require('path')
import fs = require('fs')
import configExtend = require('config-extend')
import chokidar = require('chokidar')
import mkdirp = require('mkdirp')

export let defaultCompilerOptions:ts.CompilerOptions = {
  module:ts.ModuleKind.AMD,
  target:ts.ScriptTarget.ES5,
  jsx:ts.JsxEmit.React,
  sourceMap:false,
}

export class Shot {
  constructor(file){
    this.filename = file
  }
  filename?:string
  version:string = '1'
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
      getScriptFileNames:()=>Object.keys(this.files),
      getScriptVersion:(file)=>this.files[file].version,
      getScriptSnapshot:(file)=>!fs.existsSync(file)?undefined:ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString()),
      getCurrentDirectory:()=>rootDir,
      getDefaultLibFileName:(options)=>ts.getDefaultLibFilePath(options)
    })
    this.FSWatch = chokidar.watch(rootDir,{ ignored:['.git'] })
      .on('change',this.updateFilesShot)
  }
  FSWatch:chokidar.FSWatcher
  updateFilesShot = (file)=>{
    file = Compile.normalize(file)
    if(!Reflect.has(this.files,file)){
      return
    }
    let shot = this.files[file]
    shot.version = (Number(shot.version) + 1).toString()
    shot.expired = true
  }
  service:ts.LanguageService
  static normalize = (f)=>f.replace(/\\/g,'/')
  files = new Proxy<{[key:string]:Shot}>({},{
    get(target,filename:string){
      filename = Compile.normalize(filename) //路径标准化
      if(!target[filename]){
        let shot = target[filename] = new Shot(filename)
        // for(let key in target){
        //   target[key].expired = true
        // }
      }
      return target[filename]
    },
  })
  getAllImports = (file:string):string[]=>{
    file = this.files[file].filename 
    let resolvedModules:any[] = (this.service.getProgram().getSourceFile(file) as any).resolvedModules
    let modules:string[] = []
    if(resolvedModules){
      modules = Array.from(resolvedModules.values()).map<string>((a:any)=>a.resolvedFileName) // typescript 没有公开的属性
    }
    return modules.reduce( (p,v)=>p.concat(this.getAllImports(v)), [file] )
  }
  getImports = (file:string)=>this.getAllImports(file).filter(m=>!(/node_modules/.test(m)))
  compile = (filename)=>this.service.getEmitOutput(filename)
}
