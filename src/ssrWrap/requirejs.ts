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
export let requirejsScript:string
export let requirejsConfig = (requirejsConfig?:RequireConfig)=>{
  configExtend(requirejs,requirejsConfig)
  requirejsScript = 'var requirejs='+JSON.stringify(requirejs)
}
requirejsConfig() // init , create requirejsBuffer