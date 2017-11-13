import { data, render, getCompiledImports } from "./render";
import { createHash } from "crypto";
import { cacheDir } from ".";
import path = require('path')
import fse = require('fs-extra')
export type cb = (err:Error,html:string)=>any
//clear last cache
fse.removeSync(cacheDir)
//make cache dir
fse.mkdirpSync(cacheDir)
export const getCacheFileWithHash = (file:string,data:data)=>{
  const { compilerId, compiler } = data
  const hash = createHash('md5').update(JSON.stringify({ ...data, compiler:compilerId })).digest('hex')
  const cacheFileWithHash = path.join(cacheDir,compilerId+'.'+file.replace(/\:|\\|\//g,'_')+'.'+hash)
  return cacheFileWithHash
}
export const renderWithCache = async(file:string,data:data,cb?:cb)=>{
  const { cache } = data
  let html:string,error:Error
  html=error=null
  if( cache ){
    let cacheFileWithHash = getCacheFileWithHash(file,data)
    if(await fse.pathExists(cacheFileWithHash)){
      html = await fse.readFile(cacheFileWithHash,'utf8')
    }
  }
  await render(file,data).then(
    (renderedString)=>html=renderedString,
    (catchedError)=>error=catchedError,
  )
  if(cache){
    let cacheFileWithHash = getCacheFileWithHash(file,data)
    await fse.writeFile(cacheFileWithHash,html)
  }
  //return
  if(typeof cb==='function'){
    cb(error,html)
  }else{
    if(error)throw error;
    else return html;
  }
}