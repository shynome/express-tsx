import ts = require('typescript')
import fs = require('fs')
import configExtend = require('config-extend')
import chokidar = require('chokidar')
export class Compile {
  static defaultCompilerOptions:ts.CompilerOptions = {
    module:ts.ModuleKind.AMD,
    target:ts.ScriptTarget.ES5,
    jsx:ts.JsxEmit.React,
    outFile:'bundle.js'
  }
  compilerOptions:ts.CompilerOptions
  files = []
  file:string
  filesCache = new Map()
  languageService:ts.LanguageService
  constructor(compileOptions?:ts.CompilerOptions,rootDir=process.cwd()){
    this.compilerOptions = configExtend({},Compile.defaultCompilerOptions,compileOptions)
    this.languageService = ts.createLanguageService({
      getCompilationSettings:()=>this.compilerOptions,
      getScriptFileNames:()=>[this.file],
      getScriptVersion:(file)=>this.filesCache.get(file) && this.filesCache.get(file).toString(),
      getScriptSnapshot:(file)=>{
        if(!fs.existsSync(file)){
          return undefined
        }
        return ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString())
      },
      getCurrentDirectory:()=>process.cwd(),
      getDefaultLibFileName:(options)=>ts.getDefaultLibFilePath(options)
    })
  }
  updateCache = (file:string)=>{
    if(this.filesCache.has(file)){
      return
    }
    this.filesCache.set(file,0)
    this.files.push(file)
    chokidar
      .watch(file)
      .on('change',()=>{
        this.filesCache.set(file,this.filesCache.get(file)+1)
      })
      .on('unlink',()=>{
        this.filesCache.delete(file)
        let index = this.files.indexOf(file)
        if(index!==-1){
          this.files.splice(index,1)
        }
      })
  }
  compile = (file:string):Promise<string>=>new Promise((resolve,reject)=>{
    // this.updateCache(file)
    this.file = file
    let output = this.languageService.getEmitOutput(file)
    this.languageService.getProgram
    if( output.emitSkipped ){
      return reject(`compile ${file} failed`)
    }
    resolve(output.outputFiles[0].text)
  })
}