# Change Log

## [5.x.x]
- [ √ ] 每个 `expressTsx` 实例都有单独的 `tsconfig` 配置
- [ √ ] 编译器封装独立成一个单独包 `express-tsx-compiler`
- [ × ] 不损失状态下进行热更新
- [ × ] 符合`consolidate`规范


## [4.2.6]
- 不再强制使用 `?callback=define` 获取初始化数据 , 转而提供一个 `?props` 路径以供获取数据
- 动态更新模块达成 . 需要通过 app.locals.hotreload = true 来开启
- 以上均在 [`example/index.js`](./example/index.js) 中有更新

## [4.1.0]
### 增加了下列 api
- `exports.expressTsx(viewsDir?:string,app=express())`可直接获取一个设定好`express-tsx`视图引擎的`express`服务. 如果要配置已存在的服务话,把模板文件夹和已有的服务都传入进去就好了
- `exports.expressTsxMiddleware`是`exports.middleware`的别名

## [4.0.0]
- 重写了`Compile`, 移除了`chokidar`依赖 , 文件监听更加具有针对性了
- 修复了各种`linux`上的bug