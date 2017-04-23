
# 介绍
这是 express 中 jsx 模板渲染的一个实现 .

它提供了两种渲染模式 , 一种 ["静态HTML渲染"](#静态HTML渲染) , 一种 ["服务器同构渲染"](#服务器同构渲染)

## 静态 HTML渲染

调用 `ReactDOM.renderToStaticMarkup` 方法渲染 `require('tsxmodule').default || require('tsxmodule')`

[app 主文件](./example/staticHTMLRender.ts)
```typescript

import Express = require('express')
export const app = Express()

import { render } from "../";
app.engine('.tsx',render())
app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.get('/',(req,res)=>res.render('staticHTMLRender',{ who:'express-tsx', title:'express-tsx' }))
```
[tsx 视图文件](./example/views/staticHTMLRender.tsx)
```typescript react

export default (props)=>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  <title>{props.title}</title>
</head>
<body>
  hello {props.who}
</body>
</html>
```

## 服务器同构渲染

这个的实现就比较绕了 , 建议直接看 [源码](./src)

[app 主文件](./example/ssrRender.ts)
```typescript

import Express = require('express')
export const app = Express()

import { render } from "../";
app.engine('.tsx',render({ ssr:true }))
app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.get('/',(req,res)=>res.render('ssrRender',{ who:'express-tsx', title:'express-tsx' }))
```
[tsx 视图文件](./example/views/ssrRender.tsx)
```typescript react

export default (props)=>
<div onClick={ ()=>alert(props.who) }>
  hello {props.who}
</div>
```

# 最后
如果有好的建议欢迎提 issue | pr 哦 !