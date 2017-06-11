
import Express = require('express')
export const app = Express()

import { render,requirejsConfig,defaultOptions } from "../src";

//你可以在这里配置 requirejs , 这下面是一些默认配置
requirejsConfig({
  baseUrl         :'//unpkg.com/',
  paths:{
    'requirejs'   :'requirejs@2.3.3/require',
    'react'       :'react@15.5.4/dist/react.min',
    'react-dom'   :'react-dom@15.5.4/dist/react-dom.min',
    'glamor'      :'glamor@2.20.25/umd/index.min',
    'glamorous'   :'glamorous@3.22.1/dist/glamorous.umd.min',
  },
})

app.engine('.tsx',render({
  ssr:false, //推荐关闭
  // ssrRender,
  // ssrWrap, //这个是核心 , 不建议替换
  // placeholder:'loading', //你可以在这里放个 loading 动画
}))
//此外你还可以在这 `defaultOptions` , 设置所有的默认值(对已经使用了 `render` 的不起效 )
defaultOptions.placeholder = 'loading'

app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.get('/deep/path',(req,res)=>res.render('ssrRender',{ who:'express-tsx', title:'express-tsx' }))
app.get('/',(req,res)=>res.render('ssrRender',{  }))