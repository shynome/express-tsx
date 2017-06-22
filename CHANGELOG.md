# Change Log


## [future]
- ts2.4 `import()` 异步加载的文件会被提前推送 -> 不提前推送

## [3.1.19] - 2017-6-23
### fixed bug 
- `bug` : 标准化路径时如果没有盘符时会把整个路径都小写
- `heroku` 兼容达成

## [3.1.18] - 2017-6-23
### fixed bug 
- `bug` : 获取文件依赖时:两个文件互相引用会出现内存溢出
- `typescript` 版本回退 

## [3.1.17] - 2017-6-21
### change
- `fileVersion` 现在使用 `hash` 值表示一致
- `typescript` 版本回退 

## [3.1.15] - 2017-6-15
### fixed
- relativePath 取的根路径 `req.app.path()`  有问题 , 更改为 新增变量`req.expressTsxRoot`

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
