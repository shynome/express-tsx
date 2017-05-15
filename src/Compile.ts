import ts = require('typescript')
import path = require('path')
import express = require('express')
import fs = require('fs')
import configExtend = require('config-extend')
import chokidar = require('chokidar')
import mkdirp = require('mkdirp')

export let defaultOutDir = '.tsx_compile'
export let defaultCompilerOptions:ts.CompilerOptions = {
  module:ts.ModuleKind.AMD,
  target:ts.ScriptTarget.ES5,
  jsx:ts.JsxEmit.React,
  sourceMap:false,
  outDir:defaultOutDir,
}

export class Shot {
  version:string = '1'
  outputFile:string
  filename:string
  expired:boolean = true
}

export class Compile {
  static defaultCompilerOptions = defaultCompilerOptions
  compilerOptions:ts.CompilerOptions = {}
  outDir:string
  constructor(options?:ts.CompilerOptions,rootDir=process.cwd()){
    configExtend(this.compilerOptions,Compile.defaultCompilerOptions,options)
    let { outDir } = this.compilerOptions
    this.compilerOptions.outDir = path.join(rootDir,outDir)
    this.service = ts.createLanguageService({
      getCompilationSettings:()=>this.compilerOptions,
      getScriptFileNames:()=>Object.keys(this.files),
      getScriptVersion:(file)=>this.files[file].version,
      getScriptSnapshot:(file)=>!fs.existsSync(file)?undefined:ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString()),
      getCurrentDirectory:()=>rootDir,
      getDefaultLibFileName:(options)=>ts.getDefaultLibFilePath(options)
    })
    this.FSWatch = chokidar.watch(rootDir,{ignored:'.git'})
      .on('change',(file)=>{
        if(!Reflect.has(this.files,file)){
          return
        }
        let shot = this.files[file]
        shot.version = (Number(shot.version) + 1).toString()
        shot.expired = true
      })
    this.middleware = express.static(this.compilerOptions.outDir)
  }
  FSWatch:chokidar.FSWatcher
  middleware:express.Handler
  service:ts.LanguageService
  files = new Proxy<{[key:string]:Shot}>({},{
    get(target,file:string){
      file = require.resolve(file)
      if(!target[file]){
        target[file] = new Shot()
        for(let key in target){
          target[key].expired = true
        }
      }
      return target[file]
    },
  })
  static filterFiles = (file:string)=>!(/node_modules/.test(file))
  static getDeps = (m:NodeModule):string[]=>m.children.reduce((deps,m)=>deps.concat(Compile.getDeps(m)),[m.filename])
  compile:(file:string)=>string = (file)=>{
    file = require.resolve(file)
    let deps = Compile.getDeps(require.cache[file])
    let expiredFiles = deps.filter(Compile.filterFiles).filter(f=>this.files[f].expired)
    if(expiredFiles.length){
      expiredFiles.forEach(file=>{
        let outputFiles = this.service.getEmitOutput(file).outputFiles
        outputFiles.forEach(o=>{
          mkdirp.sync(path.dirname(o.name))
          fs.writeFileSync(o.name,o.text)
        })
        let shot = this.files[file]
        shot.expired = false
        shot.outputFile = path.relative(this.compilerOptions.outDir,outputFiles.slice(-1)[0].name)
      })
    }
    return this.files[file].outputFile
  }
}

export let compile = new Compile()