//创建包含 express-tsx 视图引擎的 express 服务
const { expressTsx,expressTsxMiddleware } = require('../')
const server = expressTsx(__dirname)
server.locals.hotreload = true
//服务监听
server.listen(9000,function(){ console.log(`server is running on ${this.address().port}`) })
//**注意**:在渲染视图前需要根路由注入中间件
server.use(expressTsxMiddleware)
require('./requirejs.config')
//渲染视图
server.use('/',(req,res)=>{
  if(!req.query.callback){ return res.render('./view.tsx') }
  res.jsonp({word:'world'})
})