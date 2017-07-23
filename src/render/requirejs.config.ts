import path = require('path')
import requirejs = require('requirejs')
requirejs.config({
  paths:{
    'react'           :'//cdn.bootcss.com/react/15.6.1/react.js#',
    'react-dom'       :'//cdn.bootcss.com/react/15.6.1/react-dom.js#',
    'requirejs'       :'//cdn.bootcss.com/require.js/2.3.3/require.min.js#',
    'css'             :'//cdn.bootcss.com/require-css/0.1.10/css.min.js#',
    'es5-shim'        :'//cdn.bootcss.com/es5-shim/4.5.9/es5-shim.min.js#',
    'es6-shim'        :'//cdn.bootcss.com/es6-shim/0.35.3/es6-shim.min.js#',
  },
  shim:{
    'react'           :{ deps:['es6-shim','es5-shim'] },
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