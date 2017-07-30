import path = require('path')
import requirejs = require('requirejs')
requirejs.config({
  baseUrl:'https://unpkg.com/',
  paths:{
    'requirejs'       :'requirejs/require.js#',
    'react'           :'react/dist/react.js#',
    'react-dom'       :'react-dom/dist/react-dom.js#',
    'css'             :'require-css/css.min.js#',
    'es6-shim'        :'es6-shim/es6-shim.min.js#',
  },
  shim:{
    'react'           :{ deps:['es6-shim'] },
  }
})
export const getRequirejsConfig = ()=>requirejs.s.contexts._.config
import { sys } from 'typescript'
import { requirejsConfigPath } from "./html";
import { compiler as default_compiler } from "../Compile";
export const requirejsConfig = (config?:any,compiler=default_compiler,savePath=requirejsConfigPath)=>{
  requirejs.config(config)
  sys.writeFile(savePath,`requirejs.config(${JSON.stringify(getRequirejsConfig())})`)
  !compiler.development && compiler.updateScriptVersion(savePath)
}
requirejsConfig()