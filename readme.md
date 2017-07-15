
# 介绍

express 视图引擎 tsx 的实现 .

# 安装

```shell
npm install express-tsx typescript --save
```

# 使用示例
[主文件](./example/server.js)
```javascript
//创建 express 服务
const express = require('express')
const server = express()
server.listen(9000,function(){ console.log(`server is running on ${this.addresss().port}`) })
//设定视图引擎
server.engie('.tsx',require('express-tsx').render)
server.set('views',__dirname)
server.set('view engie','tsx')//选择视图引擎
//**注意**:在渲染视图前需要根路由注入中间件
server.use(require('express-tsx').middleware)
//渲染视图
server.ues('/',(req,res)=>res.render('./view.tsx'))
```
- [视图文件](./example/view.tsx)
```jsx typescript
import React = require('react')
alert('express-tsx' as any)
export default ()=>
<div>
  hello world
</div>
```

# 示例运行
- 克隆本项目
  ```shell
  git clone https://github.com/shynome/express-tsx.git
  ```
- 安装依赖
  ```shell 
  npm install
  ```
- 进入示例目录
  ```shell
  cd example
  ```
- 运行
  ```shell
  npm start
  ```
- 在浏览器中打开 [示例:http://127.0.0.1:9000/](http://127.0.0.1:9000/)  
  一切正常的话会看到 : `hello world`