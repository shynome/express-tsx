# 文档
**当前版本不适合用于生产环境,因为测试不完善**

## 使用

```js
/**@type {Express}*/
var app = expressTsx(viewsDir="/views",app=Express())

```

## 核心

- **编译器**
- **tsx文件**
- **html载体** 充当编译后的文件入口, __模板数据__ 就是用在这里的, 结构顺序如下(可配置选项用标注了):
  - __head__
  - _`lang='en'`_ html语言配置
  - _`title='express-tsx'`_ html标题
  - _`keywords=''`_ html关键词
  - _`description=''`_ html描述
  - _`heads:string[]=[]`_ 用以配置头部信息
  - _`<script src=${requirejs.toUrl("requirejs")}></script>`_ 引用`requirejs`
  - __body__
  - _`loading='loading html...'`_ 在 `requirejs` 引用前写入
  - _`div#app'`_ app挂载点
  - _`<script src=${browserRenderJs}> imports_files:[${renderfile},...string[]]=[] </script>`_ 
    使用浏览器配置脚本进行渲染
  - _`foots:string[]=[]`_ 用以放置统计脚本之类的
- **编译好的静态文件服务**

***

## 扩展

- **缓存** 通过 `{ cache:boolean }` 来开关, 开启后将生成一个名为 `${id}.${renderfile}.${hash}` 的html载体
  - `id`是内置编译器编号
  - `renderfile` 是被渲染的文件
  - `hash` 是 `JSON.stringify(data)` 的 `hash` 值
- **热更新** 通过 `event-source` 发送更新事件, 实现如下:
  - 浏览器配置脚本发起热更新请求, 带上 `id` 和 `renderfile` 参数
  - `(req,res)=>void` 收到请求后, 找对应编译器的更新事件监听器, 监听事件,
    就绪时时发送 { `event`:ping }
    收到更新事件时发送 `{ event:update, data:changefile }`
- **浏览器模块配置** 使用 `requirejs` 做的模块加载器, 所以配置都继承 `requirejs`, 下面是需要额外说明的配置
  - _`transform=false`_ 开启后, 在生产环境下 `paths` 配置中的 `/node_modules/module/path` 会被转换为 `https://unpkg.com/module@version/path`
  - _`callback`_ 之类的不可序列化的配置是无效的 (比如不能被 `JSON.stringify` 转成字符串的属性)

***
