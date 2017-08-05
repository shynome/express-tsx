import React = require('react')
console.log('express-tsx' as any)
export type Props = { word:string }
// 导出用以渲染组件的数据
export const props = require('?props');import '?props'; //从 '?props' 中获取服务器数据
// 导出用以渲染的组件或者组件实例 , 导出名为 View || default
export const View:React.StatelessComponent<Props> = (props)=>
<div>
  hello {props.word}
</div>