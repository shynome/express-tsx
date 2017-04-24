import ts = require('typescript')
import fs = require('fs')
import configExtend = require('config-extend')
import chokidar = require('chokidar')
export class Shot {
  version:number = 0
  compiledCode?:string
  expired?:boolean = false
  includeFiles? = new Set<Shot>()
}
export class Compile {
  static defaultCompilerOptions:ts.CompilerOptions = {
    module:ts.ModuleKind.AMD,
    target:ts.ScriptTarget.ES5,
    jsx:ts.JsxEmit.React,
    outFile:'bundle.js',
  }
  compilerOptions:ts.CompilerOptions = Compile.defaultCompilerOptions
  file:string
  filesVersion = new Map<string,Shot>()
  service:ts.LanguageService
  constructor(compileOptions?:ts.CompilerOptions,rootDir=process.cwd()){
    let compilerOptions = this.compilerOptions = configExtend(this.compilerOptions,compileOptions)
    let { filesVersion } = this
    let defaultLibFileName = ts.getDefaultLibFilePath(this.compilerOptions)
    this.service = ts.createLanguageService({
      getCompilationSettings:()=>this.compilerOptions,
      getScriptFileNames:()=>[this.file],
      getScriptVersion:(file)=>{
        let shot:Shot
        if(!filesVersion.has(file)){
          filesVersion.set(file,new Shot())
          shot = filesVersion.get(file)
          //add watch
          chokidar.watch(file)
            .on('change',function(){
              shot.version ++
              shot.expired = true
            })
            .on('unlink',function(this:chokidar.FSWatcher){
              this.close()
              filesVersion.delete(file)
            })
        }else{
          shot = filesVersion.get(file)
        }
        let mainShot = filesVersion.get(this.file)
        if(mainShot.includeFiles.has(shot)){
          shot.expired = false
        }else{
          mainShot.includeFiles.add(shot)
        }
        return shot.version.toString()
      },
      getScriptSnapshot:(file)=>{
        if(!fs.existsSync(file)){
          return undefined
        }
        return ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString())
      },
      getCurrentDirectory:()=>rootDir,
      getDefaultLibFileName:(options)=>defaultLibFileName
    })
  }
  compile = (file:string):string=>{
    let shot = this.filesVersion.get(file)
    let code:string
    let expired:boolean = true
    if(!shot){
      expired = true
    }else if(!!Array.from(new Set(shot.includeFiles)).filter(({expired})=>expired).length){
      expired = true
    }else{
      expired = false
      code = shot.compiledCode
    }
    if(expired){
      code = this.service.getEmitOutput(this.file = file).outputFiles[0].text
      if(!shot){
        shot = this.filesVersion.get(file)
      }
      shot.expired = false
      shot.compiledCode = code
    }
    return code
  }
}