# Change Log

## [Unreleased]
- ts2.4(未发布) `import()` 异步加载兼容
- `heroku` 兼容
- `sourceMap` `file:///` 协议支持 

## [3.1.14] - 2017-6-14
### fixed
- relativePath 取的根路径 `req.app.path()`  有问题 , 更改为 `req.baseUrl` // 具体看 `git` (不会链接,囧)

## [3.1.1] - 2017-6-13
### add
- 添加 `sourceMap` 支持

## [3.1.0] - 2017-6-11
### optimization
- 添加 glomarous(css in js) 到默认配置中 , 现在可以尝试使用该组件进行模块式开发了

## [2.2.5] - 2017-5-7
### fixed
- ssrWrap 使用了'/'定位到输出文件夹路径, 导致require不能正常解析模块路径

## [2.1.4] - 2017-4-27
### update
- 导出 React 到全局声明

## [2.1.0] - 2017-4-23
### changed
- 优化了 tsx 文件编译函数 , 加入了缓存 .
