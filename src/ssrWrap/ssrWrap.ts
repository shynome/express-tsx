
import { requirejsConfigPath,requirejs } from './requirejs'
import { ssrWrap } from './'
import configExtend = require('config-extend')
import { config } from "../";
import { push } from "./push";
import { compile } from "./Compile";
import { join } from "path";
export let bowerRenderScript = compile.files[join(__dirname,'../../static/bowerRender.ts')].filename
export const wrap:ssrWrap = function( body, ViewData, file, data  ){
    ViewData = new config(ViewData)
let { imports, pushEtag } = push( body, ViewData, file,data)
let [ requirejsConfigPath,bowerRenderScript ] = imports.slice(-2)
return `
<!DOCTYPE html>
<html lang="${ ViewData.lang }">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="X-UA-Compatible" content="ie=edge"/>
<title>${ ViewData.title }</title>
</head>
<body>
  <div id="app">${ body }</div>
  <script src="${requirejsConfigPath}"></script>
  <script src="${requirejs.paths['requirejs']}.js"></script>
  <script src="${bowerRenderScript}">${JSON.stringify(imports)}</script>
  <script>
  </script>
</body>
</html>
`
}