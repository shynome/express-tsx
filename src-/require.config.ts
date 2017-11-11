import { Express, Router, static as staticServer } from "express";
import { Compile, Vars, key } from ".";
import path = require('path')
export type _any = { [key:string]:any }
export type RequirejsConfig = {
  [key:string]:any
  baseUrl?: string
  paths?: _any
  /** Introduced in RequireJS 2.1.10: allows configuring multiple module IDs to be found in another script. */
  bundles?: _any
  shim?: _any
  map?: _any
  config?: _any
  packages?: _any
  nodeIdCompat?: _any
  /** The number of seconds to wait before giving up on loading a script. Setting it to 0 disables the timeout. The default is 7 seconds. */
  waitSeconds?: number
  /**会被设置为一个唯一id */
  context?: string
}
export let defaultRequirejsConfig = {
  paths:{
    'requirejs'               :'https://unpkg.com/requirejs@2.3.4/require.js#',
    'react'                   :'https://unpkg.com/react@16.0.0/umd/react.production.min.js#',
    'react-dom'               :'https://unpkg.com/react-dom@16.0.0/umd/react-dom.production.min.js#',
    'css'                     :'https://unpkg.com/require-css@0.1.10/css.min.js#',
    'es6-shim'                :'https://unpkg.com/es6-shim@0.35.3/es6-shim.min.js#',
    'redux'                   :'https://unpkg.com/redux@3.7.2/dist/redux.min.js#',
    'react-redux'             :'https://unpkg.com/react-redux@5.0.5/dist/react-redux.min.js#',
    'event-source-polyfill'   :'https://unpkg.com/event-source-polyfill@0.0.9/eventsource.min.js#',
  },
  shim:{
    'react'                   :{ deps:['es6-shim'] },
  },
  map:{
    
  }
}
import Requirejs = require('requirejs')
export let cursor = 0
import crypto = require('crypto')
export const requirejsConfig = (app:Express)=>(config:any={}):RequirejsConfig=>{
  let id = app.get(key.requirejsId)
  if(!id){
    id = `store${cursor++}`
    app.set(key.requirejsId,id)
    const requirejs = Requirejs.config({ context:id, ...defaultRequirejsConfig })
    app.set(key.requirejs,requirejs)
    app.get(key.requirejsConfigJsPath,(req,res)=>res.type('js').header({maxAge:15*24*60*60}).send(res.app.get(key.requirejsConfigStr)))
  }
  config = transform(config,app)
  Requirejs.config({ context:id, ...config })
  config = Requirejs.s.contexts[id].config
  let configStr = `requirejs.config(${JSON.stringify({ ...config, context:'_', })})`
  app.set(key.requirejsConfigStr,configStr)
  let hash = crypto.createHash('md5').update(configStr).digest('hex')
  app.set(key.requirejsConfigJsPathWithHash,`${key.requirejsConfigJsPath}?${hash}`)
  return config
}
//transform paths
export const regx = /^.*\/*node_modules\/(\@[^\/]+\/[^\/]+|[^\/]+)\/(.+)$/
export const dependencies:{ [module:string]:{ version:string } } = require(path.resolve('package-lock.json')).dependencies
/** tranfrom local node_modules to https://unpkg.com/ cdn */
export const transform = (config:any={},app:Express)=>{
  const compiler:Compile = app.get(key.compiler)
  const dev = compiler.development
  const cdn = dev ? Vars.node_modules : Vars.cdn
  let { paths = {} } = config
  for(let module in paths ){
    let path:string = paths[module]
    let match = path.match(regx)
    if(!match)continue;
    let [ , name, filepath ] = match
    let version = dependencies[name].version
    paths[module] = `${cdn}/${name}${dev?'':'@'+version}/${filepath}#`
  }
  return config
}