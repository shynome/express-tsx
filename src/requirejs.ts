import fs = require('fs')
import { compile } from "./Compile";
import { join } from "path"; 
// join compile files
export let requirejsConfigPath = compile.files[join(__dirname,'../static/require.config.tsx')].filename
export let requirejsUrl = ''
export const requirejs:Require = require('requirejs')
// proxy reuqirejs config
const originRequirejsConfig = requirejs.config
requirejs.config = function(config:RequireConfig){
  originRequirejsConfig.apply(this,arguments)
  // update config after config
  requirejsUrl = requirejs.toUrl('requirejs')
  fs.writeFileSync(
    requirejsConfigPath,
    'var requirejs='+JSON.stringify((requirejs as any).s.contexts._.config),
  )
  return this
}
// default config
requirejs.config({
  baseUrl         :'//unpkg.com/',
  paths:{
    'requirejs'   :'requirejs@2.3.3/require',
    'react'       :'react@15.5.4/dist/react.min',
    'react-dom'   :'react-dom@15.5.4/dist/react-dom.min',
    'glamor'      :'glamor@2.20.25/umd/index.min',
    'glamorous'   :'glamorous@3.22.1/dist/glamorous.umd.min',
    'es6-shim'    :'es6-shim@0.35.3/es6-shim.min',
  },
  shim :{
    'glamorous'   :[ 'es6-shim' ]
  }
})
// Compatible with previous interfaces
export const requirejsConfig = (requirejsConfig?:RequireConfig)=>requirejs.config(requirejsConfig)
// init , create requirejsBuffer
requirejsConfig() 