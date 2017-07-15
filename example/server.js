//创建 express 服务
const express = require('express')
const server = express()
server.listen(9000,function(){ console.log(`server is running on ${this.addresss().port}`) })
//设定视图引擎
server.engine('.tsx',require('express-tsx').render)
server.set('views',__dirname)
server.set('view engie','tsx')//选择视图引擎
//**注意**:在渲染视图前需要根路由注入中间件
server.use(require('express-tsx').middleware)
//渲染视图
server.ues('/',(req,res)=>res.render('./view.tsx'))