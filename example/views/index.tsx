import React = require('react')
export const App = (props)=>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  <title>{props.title}</title>
</head>
<body>
  {props.children}
</body>
</html>