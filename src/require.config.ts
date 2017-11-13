import { Express } from "express";
import { Compile, key, Vars } from ".";
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
    'requirejs':
      'https://unpkg.com/requirejs@2.3.4/require.js#',
    'react':
      'https://unpkg.com/react@16.0.0/umd/react.production.min.js#',
    'react-dom':
      'https://unpkg.com/react-dom@16.0.0/umd/react-dom.production.min.js#',
    'css':
      'https://unpkg.com/require-css@0.1.10/css.min.js#',
    'es6-shim':
      'https://unpkg.com/es6-shim@0.35.3/es6-shim.min.js#',
    'redux':
      'https://unpkg.com/redux@3.7.2/dist/redux.min.js#',
    'react-redux':
      'https://unpkg.com/react-redux@5.0.5/dist/react-redux.min.js#',
    'event-source-polyfill' :
      'https://unpkg.com/event-source-polyfill@0.0.9/eventsource.min.js#',
  },
  shim:{
    'react':
      { deps:['es6-shim'] },
  },
  map:{
  }
}
import Requirejs = require('requirejs')
export let cursor = 0
import crypto = require('crypto')
export const bindRequirejsConfig = (app:Express)=>{
  app.settings[key.requirejsId] = `store${cursor++}`
  Object.defineProperty(app.settings,key.requirejsConfig,{
    get(){ return Requirejs.s.contexts[this.requirejsId].config },
    set(config){
      Requirejs.config({ context:this.requirejsId, ...config })
      config = this[key.requirejsConfig]
      //remake config str
      let configStr =
          this[key.requirejsConfigStr] = 
          `requirejs.config(${JSON.stringify({ ...config, context:'_', })})`
      //update hash path
      let hash = crypto.createHash('md5').update(configStr).digest('hex')
      this[key.requirejsConfigJsPathWithHash] = `${key.requirejsConfigJsPath}?${hash}`
    }
  })
  //set default config
  app.settings[key.requirejsConfig] = defaultRequirejsConfig
  //set url
  app.get(
    key.requirejsConfigJsPath,
    (req,res)=>
      res.type('js').header({maxAge:15*24*60*60}).send(res.app.settings[key.requirejsConfigStr])
  )
}