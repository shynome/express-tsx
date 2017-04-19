
export  const App = ({ lang='zh-hms-cn', title='title',children=[] })=>
<html lang={lang}>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  <title>{title}</title>
</head>
<body>
  {children}
</body>
</html>
