import ts = require('typescript')
import path = require('path')
import fs = require('fs')
import configExtend = require('config-extend')
import chokidar = require('chokidar')

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
      getScriptVersion:this.getScriptVersion,
      getScriptSnapshot:(file)=>!fs.existsSync(file)?undefined:ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString()),
      getCurrentDirectory:()=>rootDir,
      getDefaultLibFileName:(options)=>ts.getDefaultLibFilePath(options)
    })
    this.FSWatch = chokidar.watch(rootDir,{ ignored:/\.git/ })
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
  static normalize = (f:string)=>f.replace(/\\/g,'/')
    //One Drive letter has two cases ( E: or e:)
    .split(':').map((drive,index)=>index?drive:drive.toLowerCase()).join(':')
  getScriptVersion = (file:string)=>this.files[file].version
  files = new Proxy<{[key:string]:Shot}>({},{
    get(target,filename:string){
      filename = Compile.normalize(filename) //路径标准化
      if(!target[filename]){
        target[filename] = new Shot(filename)
      }
      return target[filename]
    },
  })
  getAllImports = (file:string):string[]=>{
    file = this.files[file].filename 
    let resolvedModules:any[] = (this.service.getProgram().getSourceFile(file) as any).resolvedModules // typescript 没有公开的属性
    let modules:string[] = []
    if(resolvedModules){
      modules = 
        Array.from(resolvedModules.values()) 
        .filter(a=>a) //filter void
        .map<string>((a:any)=>a.resolvedFileName) 
    }
    return modules.reduce( (p,v)=>p.concat(this.getAllImports(v)), [file] )
  }
  getImports = (file:string)=>this.getAllImports(file).filter(m=>!(/node_modules/.test(m)))
  compile = (filename)=>this.service.getEmitOutput(filename)
}
