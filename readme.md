
# 介绍
express 视图引擎 tsx 的实现 .

# 安装
```shell
npm install express-tsx typescript --save
```

# 使用示例
[主文件](./example/server.js)
```javascript
//创建包含 express-tsx 视图引擎的 express 服务
const { expressTsx,expressTsxMiddleware } = require('../')
const server = expressTsx(__dirname)
//服务监听
server.listen(9000,function(){ console.log(`server is running on ${this.address().port}`) })
//**注意**:在渲染视图前需要根路由注入中间件
server.use(expressTsxMiddleware)
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
  npm install ; node example
  ```
- 在浏览器中打开 [示例:http://127.0.0.1:9000/](http://127.0.0.1:9000/)  
  一切正常的话会看到 : `hello world`

# 实现流程
* 使用[`require('express-tsx').middleware`](./src/render/middleware.ts)中间件用来注入要使用的数据
* `express` 中指定要渲染的文件 , `app.use('/path',(req,res)=>res.render(file))`
* 使用 `typescript` 将该文件及其引用的文件进行编译
* 调用用 `res.locals.express_tsx_html` 函数 返回用来渲染界面的`html`文件
* 通过[`require('express-tsx').middleware`](./src/render/middleware.ts)返回编译成`es5`的`js`文件
* 浏览器通过 [`browser.int.ts`](./static/browser.init.ts) 渲染界面

# 深入使用
## 示例1
#### 替换 `res.locals.express_tsx_html` 函数来输入你自己的 `html` 结构来应对 `seo` 等情况
* 替换`res.locals.express_tsx_html`函数, 相关代码片段:  
  [源文件](./test/render.js)
  ```typescript
  const render2 = expressTsx(__dirname)
  render2.use((req,res,next)=>{
    let originTsxHTML = res.locals.express_tsx_html
    res.locals.express_tsx_html = async(...r)=>{
      return (await originTsxHTML(...r)).replace(`<body>`,`<body>render by diy html function`)
    }
    next()
  })
  render2.use('/',(req,res)=>res.render(renderFile))
  ```

***********