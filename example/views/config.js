
var cdn = '//cdn.bootcss.com/'
requirejs.config({
  paths:{
    'react'       :cdn+'react/15.5.4/react',
    'react-dom'   :cdn+'react/15.5.4/react-dom'
  },
  shim:{
    'react-dom'   :['react'],
  }
})
function RenderApp(appModule,data){
  require(['react-dom',appModule,'react'],function(ReactDOM,app,React){
    window.React = React
    ReactDOM.render(
      app.default(data),
      document.documentElement
    )
  })
}