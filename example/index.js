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