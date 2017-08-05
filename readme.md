
# 介绍
tsx 文件的 express 的视图引擎 .  
<del>警告 : 不能用于生产环境 , 没有打包, 使用的是直接加载模块文件</del>

# 安装
```shell
npm install express-tsx typescript --save
```

# 使用示例
[主文件](./example/index.js)
```javascript
//创建包含 express-tsx 视图引擎的 express 服务
const { expressTsx,expressTsxMiddleware } = require('../')
const server = expressTsx(__dirname)
//开启 express-tsx 热更新 , 默认关闭
server.locals.hotreload = true
//服务监听
server.listen(9000,function(){ console.log(`server is running on ${this.address().port}`) })
//**注意**:在渲染视图前需要根路由注入中间件
server.use(expressTsxMiddleware)
require('./requirejs.config')
//渲染视图
server.use(/\/$/,(req,res)=>{
  if(!req.query.callback){ return res.render('./hello.tsx') }
  res.jsonp({word:'world'})
})
//还在测试 redux 中 ; 但状态管理工具并不限制于 redux 
server.get('/redux',(req,res)=>{
  res.render('./views/index.tsx')
})
```
[视图文件](./example/hello.tsx)
```jsx typescript
import React = require('react')
console.log('express-tsx' as any)
export type Props = { word:string }
// 导出用以渲染组件的数据
export const props = require('?props');import '?props'; //从 '?props' 中获取服务器数据
// 导出用以渲染的组件或者组件实例 , 导出名为 View || default
export const View:React.StatelessComponent<Props> = (props)=>
<div>
  hello {props.word}
</div>
```

# 示例运行
- 克隆本项目
  ```shell
  git clone https://github.com/shynome/express-tsx.git
  ```
- 安装依赖 ; 进入示例目录 ; 运行
  ```shell
  npm install ; node example
  ```
- 在浏览器中打开 [示例:http://127.0.0.1:9000/](http://127.0.0.1:9000/)  
  一切正常的话会看到 : `hello world`

# 实现流程
* 使用[`require('express-tsx').middleware`](./src/render/middleware.ts)中间件用来注入要使用的数据
* `express` 中指定要渲染的文件 , `app.use('/path',(req,res)=>res.render(file))`
* 使用 `typescript` 将该文件及其引用的文件进行编译
* 调用用 `render` 函数 返回用来渲染界面的`html`文件
* 通过[`require('express-tsx').middleware`](./src/render/middleware.ts)返回编译成`es5`的`js`文件
* 浏览器通过 [`browser.int.ts`](./static/browser.init.ts) 渲染界面


***********