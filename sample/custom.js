import { requirejsConfig,compiler,Compile } from '../'
//使用这个方法来配置 `requirejs.config`, 否则配置文件无法得到更新
const cdn = 'https://cdn.bootcss.com'
requirejsConfig({
  paths:{
    'react'       :`${cdn}/react/15.6.1/react.min.js#`,
    'react-dom'   :`${cdn}/react/15.6.1/react-dom.min.js#`,
  }
})
//编译选项配置, 下面是继承的优先级
compiler.compilerOptions,
{ }, // process.cwd() 下的 tsconfig 配置文件
{ target:'es5', module:'amd' } //不能与项目里的ts采用同一选项, 不然浏览器跑不起来
Object(compiler.compilerOptions,{  })//直接修改 complier.compilerOptions
//编译器是完全独立实现的, 只依赖typescript
const compiler2 = new Compile()
compiler2.staticServer //用来输出编译后的 文件, 源文件, 映射文件
