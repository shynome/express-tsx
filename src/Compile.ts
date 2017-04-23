import ts = require('typescript')
import path = require('path')
import configExtend = require('config-extend')
import chokidar = require('chokidar')
export class Compile {
  compilerOptions:ts.CompilerOptions = {
    module:ts.ModuleKind.AMD,
    target:ts.ScriptTarget.ES5,
    jsx:ts.JsxEmit.React,
    outFile:'bundle.js'
  }
  cacheFiles = new Map()
  program:ts.Program
  constructor(compileOptions?:ts.CompilerOptions,rootDir=process.cwd()){
    this.compilerOptions = configExtend({},this.compilerOptions,compileOptions)
    this.program = ts.createProgram([],this.compilerOptions)
  }
  clearCache = (file:string)=>this.cacheFiles.delete(file)
  updateCache = (file:string)=>{
    if( !this.cacheFiles.has(file) ){
      this.program = ts.createProgram([file],this.compilerOptions,undefined,this.program)
      this.cacheFiles.set(file,1)
      chokidar.watch(file)
        .on('change',this.clearCache)
        .on('unlink',this.clearCache)
    }
    return this.program
  }
  compile = (file:string):Promise<string>=>new Promise((resolve)=>{
    let program = this.updateCache(file)
    program.emit(
      program.getSourceFile(file),
      (outfile,code)=>{
        resolve(code)
      },
    )
  })
}
