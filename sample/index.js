const { expressTsx, expressTsxMiddleware } = require('../')
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
//启动服务, 在浏览器中打开 http://127.0.0.1:3000 , 稍等一会就能看到经典的 `hello world` 了
server.listen(3000)