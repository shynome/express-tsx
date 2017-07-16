
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
server.listen(9000,function(){ console.log(`server is running on ${this.address().port}`) })
//设定视图引擎
server.engine('.tsx',require('express-tsx').render)
server.set('views',__dirname)
server.set('view engie','tsx')//选择视图引擎
//**注意**:在渲染视图前需要根路由注入中间件
server.use(require('express-tsx').middleware)
//渲染视图
server.use('/',(req,res)=>res.render('./view.tsx'))
```
[视图文件](./example/view.tsx)
```jsx typescript
import React = require('react')
console.log('express-tsx' as any)
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
- 安装依赖 ; 进入示例目录 ; 运行
  ```shell
  cd example ; npm install ; npm start
  ```
- 在浏览器中打开 [示例:http://127.0.0.1:9000/](http://127.0.0.1:9000/)  
  一切正常的话会看到 : `hello world`

  # 实现流程
* 插入 `require('express-tsx').middleware` 中间件
  * 返回已编译的文件
  * 注入要使用的数据
* `express` 路由中指定要渲染的文件 , `res.render(file)`
* 使用 `typescript` 将该文件及其引用的文件进行编译
* 使用 `res.locals.express_tsx_html` 函数 返回用来渲染界面的`html`文件
* 浏览器通过 [`browser.int.ts`](./static/browser.init.ts) 渲染界面

# 深入使用
* 替换`res.locals.express_tsx_html`函数来输入你自己的`html`结构来应对`seo`等情况
  示例 :
  * 创建 [`html.js`](./test/html.js)
  * 在设置模板引擎的时候替换`express_tsx_html`函数 , [源文件](./test/render.js)
  ```typescript
  const render2 = express()
  render2.use((req,res,next)=>{
    res.locals.express_tsx_html = require('./html').html
    next()
  })
  render2.engine('.tsx',express_tsx.render)
  render2.set('views',__dirname)
  render2.set('view engine','tsx')
  render2.use('/',(req,res)=>res.render(renderFile))
  ```
