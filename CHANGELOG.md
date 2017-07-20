# Change Log

## [4.1.0]
### 增加了下列 api
- `exports.expressTsx(viewsDir?:string,app=express())`可直接获取一个设定好`express-tsx`视图引擎的`express`服务. 如果要配置已存在的服务话,把模板文件夹和已有的服务都传入进去就好了
- `exports.expressTsxMiddleware`是`exports.middleware`的别名

## [4.0.0]
- 重写了`Compile`, 移除了`chokidar`依赖 , 文件监听更加具有针对性了
- 修复了各种`linux`上的bug

## [3.1.23] - 2017-6-25
### fixed 
- `express` 会合并路径 `//` --> `/` , 这样在某些情况会丢失路径信息 .

      这个导致在 `heroku` 上部署时找不到文件 , 因为`heroku`的根路径是`/`开头的 .
      典型的像这个 `youapp.herokuapp.com/express-tsx//app/**` 的源文件路径被解析为 `app/**`, 丢失了根路径导致文件找不到

   采取的解决方法是自己解析原路径.

## [3.1.20] - 2017-6-24
### update 
- 只在开发环境开启 `chokidar` 文件更新监听

## [3.1.19] - 2017-6-23
### fixed bug 
- `bug` : 标准化路径时如果没有盘符时会把整个路径都小写

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
