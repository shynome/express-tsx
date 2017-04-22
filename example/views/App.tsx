
export  const App = ({ lang='zh-hms-cn', title='title',children=[] })=>
<html lang={lang}>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  <script src="//cdn.bootcss.com/require.js/2.3.3/require.min.js"></script>
  <script src="/views/config.js"></script>
  <title>{title}</title>
</head>
<body>
  {children}
</body>
</html>
