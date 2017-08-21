import path = require('path')
import requirejs = require('requirejs')
requirejs.config({
  paths:{
    'requirejs'               :'https://unpkg.com/requirejs@2.3.4/require.js#',
    'react'                   :'https://unpkg.com/react@15.6.1/dist/react.js#',
    'react-dom'               :'https://unpkg.com/react-dom@15.6.1/dist/react-dom.js#',
    'css'                     :'https://unpkg.com/require-css@0.1.10/css.min.js#',
    'es6-shim'                :'https://unpkg.com/es6-shim@0.35.3/es6-shim.min.js#',
    'redux'                   :'https://unpkg.com/redux@3.7.2/dist/redux.min.js#',
    'react-redux'             :'https://unpkg.com/react-redux@5.0.5/dist/react-redux.min.js#',
    'event-source-polyfill'   :'https://unpkg.com/event-source-polyfill@0.0.9/eventsource.min.js#',
    'browserInitPath'         :path.join(__dirname,'../../static/browser.init.ts'),
    'requirejsConfigPath'     :path.join(__dirname,'../../static/requirejs.browser.config.ts'),
  },
  shim:{
    'react'           :{ deps:['es6-shim'] },
  }
})
export const getRequirejsConfig = ()=>requirejs.s.contexts._.config
import { sys } from 'typescript'
import { compiler as default_compiler } from "./middleware";
export const requirejsConfig = (config?:any,compiler=default_compiler,savePath:string=requirejs.toUrl('requirejsConfigPath'))=>{
  requirejs.config(config)
  sys.writeFile(savePath,`requirejs.config(${JSON.stringify(getRequirejsConfig())})`)
  !compiler.development && compiler.updateScriptVersion(savePath)
}
requirejsConfig()