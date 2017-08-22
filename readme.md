
# 介绍
tsx 文件的 express 的视图引擎 .  
<del>警告 : 不要用于生产环境 , 没有打包, 使用的是直接加载模块文件</del>

# 安装
```shell
npm install express-tsx typescript --save
```

# 特点
- 有`sourcemap`支持, 可以轻松`debug`. 虽说默认是关闭的
- 支持热更新, 虽说是默认关闭
- `js`文件路径都带有`hash`值, 可以告别`ctrl`+`f5`了
- 编译器是完全独立的, 只依赖 typescript. 
- 编译器静态服务中间件只输出视图文件及其引用的文件, 不被引用的文件直接返回404, 所以你的文件是安全的
- 可定制程度高, 不行看 [`render.ts`](./src/render/render.ts) 就知道到底有多高了
- 虽然默认只支持`react`, 但可轻松扩展使其支持`Angular`. <del>并没有试过, 只是理论上应该可以的, 等人踩坑中</del>
- 使用`requirejs`模块加载器, 配置模块的话,要使用`require('express-tsx').requirejsConfig(config)`函数, 可看示例 [example/requirejs.config.js](./example/requirejs.config.js)

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

***********