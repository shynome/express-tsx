import { data, render as Render } from "./render";
import { createHash } from "crypto";
import { cacheDir } from ".";
import path = require('path')
import fse = require('fs-extra')
export type cb = (err:Error,html:string)=>any
export const render = async(file:string,data:data,cb?:cb)=>{
  const { cache } = data
  const hash = createHash('md5').update(JSON.stringify(data)).digest('hex')
  const cacheFile = path.join(cacheDir,file.replace(/\|\//g,'_'))
  const cacheFileWithHash = cacheFile+hash+'.'
  if( cache && fse.existsSync(cacheFileWithHash) ){
    return await fse.readFile(cacheFileWithHash,'utf8')
  }
  let html:string,error:Error
  html=error=null
  await Render(file,data).then(
    (renderedString)=>html=renderedString,
    (catchedError)=>error=catchedError,
  )
  if(cache){
    //clear last cache
    let files = await fse.readdir(cacheDir)
    await Promise.all(files.map(async(filepath)=>{
      if(filepath.indexOf(cacheFile)!==0)return;
      await fse.unlink(filepath)
    }))
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