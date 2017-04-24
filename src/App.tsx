import React = require('react');

export const BowserRender = (appModule,data)=>
`
<script>
require([],function(){
  let appModule = Object.keys(require.s.contexts._.registry).slice(-2,-1)[0]
  require([appModule],function(appModule){
    var App = appModule && appModule.default || appModule
    ReactDOM.render(
      React.createElement(App,${JSON.stringify(data)}),
      document.getElementById('app')
    )
  })
})
</script>
`

export const WrapApp = (app,{ lang='zh-hms-cn', title='title', heads=[] },children=[])=>
`
<html lang=${lang}>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  <title>${title}</title>
  <script src="//cdn.bootcss.com/react/15.5.4/react.js"></script>
  <script src="//cdn.bootcss.com/react/15.5.4/react-dom.js"></script>
  <script src="//cdn.bootcss.com/require.js/2.3.3/require.min.js"></script>
  ${heads.join('')}
</head>
<body>
  <div id="app">${app}</div>
  ${children.join('')}
</body>
</html>
`
