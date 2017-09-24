
# 介绍
tsx 文件的 express 的视图引擎 .  

### 警告:
不要用于生产环境 , 没有打包, 也许后续会和 `webpack` 集成, 
但暂时没有这个打算, 目前模块加载使用的是 `requirejs`

# 安装
```shell
npm install express-tsx typescript --save
```

# 使用
```javascript
const { expressTsx, expressTsxMiddleware } = require('express-tsx')
const server = require('express')()
//渲染界面前必须要注入 `expressTsxMiddleware` 中间件, 否则会渲染失败.
//建议在主路由中注入, 该中间件只执行一次
server.use(expressTsxMiddleware)
//设定好了视图引擎的子服务. 注: 没有被设为默认视图引擎, 所以需要带上后缀名
const miniServer = expressTsx(__dirname)
miniServer.use((req,res,next)=>{
  res.local.hotreload = false //默认热重载界面是关闭的, 需要手动开启
})
miniServer.get('/',(req,res)=>res.render('./view.tsx'))
//使用子服务
server.use('/',miniServer)
```
```jsx
import *as React from 'react'
export default <div>hello world</div>
```
# 深入使用
[ 点击查看 sample/custom.js ](./sample/custom.js)

************************************