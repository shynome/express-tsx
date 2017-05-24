import configExtend = require('config-extend')
export let requirejs:RequireConfig = {
  paths:{
    'requirejs'   :'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min',
    'react'       :'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react',
    'react-dom'   :'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom',
  },
  shim:{
    'react-dom'   :['react']
  }
}
import fs = require('fs')
import { compile } from "./Compile";
export let requirejsConfigPath = compile.files[require.resolve('./_requirejs.config')].filename
export let requirejsConfig = (requirejsConfig?:RequireConfig)=>new Promise((resolve,reject)=>{
  configExtend(requirejs,requirejsConfig)
  fs.writeFileSync(
    requirejsConfigPath,
    'var requirejs='+JSON.stringify(requirejs),
    // (err)=>err?reject(err):resolve(requirejsConfigPath)
  )
})
requirejsConfig() // init , create requirejsBuffer