export const ssrWrap = (body:string,Render:string,data,requirejs:RequireConfig)=>{
let { lang='en',heads=[],title='hello express' } = data
return `
<!DOCTYPE html>
<html lang="`+lang+`">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  `+heads.join('')+`
  <script>var requirejs=`+JSON.stringify(requirejs)+`</script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js"></script>
  <title>`+title+`</title>
</head>
<body>
  <div id="app">`+body+`</div>
  <script>
  require(['`+Render+`','react-dom','react'],function(exports,ReactDOM,React){
    var Render = exports && exports.default || exports
    ReactDOM.render(
      React.createElement(Render,`+JSON.stringify(data)+`),
      document.getElementById('app')
    )
  })
  </script>
</body>
</html>
`
}