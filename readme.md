

## 警告
- 当前版本不支持 typescript 2.4.1 

# 介绍
这是 express 中 jsx 模板渲染的一个实现 .

# 安装

```shell
npm install express-tsx typescript
```

# 使用

[app 主文件](./example/ssrRender.ts)
```typescript

import Express = require('express')
export const app = Express()

import { render,requirejsConfig,defaultOptions,middleware } from "expres-tsx";

app.use(middleware) // important !!! 你需要在渲染页面之前注入这个中间件 , 这个中间会使用 '/express-tsx' 路径 , 不能覆盖该路径

//你可以在这里配置 requirejs , 这下面是一些默认配置
requirejsConfig({
  baseUrl         :'https://unpkg.com/',
  paths:{
    'requirejs'   :'requirejs@2.3.3/require',
    'react'       :'react@15.5.4/dist/react.min',
    'react-dom'   :'react-dom@15.5.4/dist/react-dom.min',
    'glamor'      :'glamor@2.20.25/umd/index.min',
    'glamorous'   :'glamorous@3.22.1/dist/glamorous.umd.min',
  },
})

app.engine('.tsx',render({
  // ssrRender,
  // ssrWrap, //这个是核心 , 不建议替换
  // placeholder:'loading', //你可以在这里放个 loading 动画
}))
//此外你还可以在 `defaultOptions` 中设置默认值(对已经使用了 `render` 的不起效 )
defaultOptions.placeholder = 'loading'

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

# 优化
- https push
  如果你使用 `spdy` 的话 , 将会预推送文件到客户端 , 加快加载

# 示例运行
- 克隆本项目
  ```shell
  git clone https://github.com/shynome/express-tsx.git
  ```
- 安装依赖
  ```shell 
  npm install
  ```
- 运行
  ```shell
  npm test
  ```
  ps: 如果你使用 vscode 的话 , 你可以直接 f5 运行
- 在浏览器中打开 [示例:https://lo.shynome.com:443/](https://lo.shynome.com:443/) | [示例:http://127.0.0.1:3000/](http://127.0.0.1:3000/)
-  最后 , 如果有好的建议欢迎提 issue | pr 哦 !