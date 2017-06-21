
import { requirejsConfigPath, requirejsUrl, } from './requirejs'
import { ssrWrap } from './'
import configExtend = require('config-extend')
import { config } from "../";
import { push } from "./";
import { compile } from "./Compile";
import { join } from "path";
export const bowerRenderScript = compile.scriptVersion[join(__dirname,'../static/bowerRender.tsx')].filename
export const wrap:ssrWrap = function( body, ViewData, file, data  ){
    ViewData = new config(ViewData)
let { imports, pushEtag } = push(file, data, ViewData, [ requirejsConfigPath, bowerRenderScript, ])
let [ requirejsConfigUrl, bowerRenderScriptUrl, ] = imports.slice(-2)
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
  <script src="${requirejsConfigUrl}"></script>
  <script src="${requirejsUrl}.js"></script>
  <script src="${bowerRenderScriptUrl}">${JSON.stringify(imports)}</script>
  <script>
  </script>
</body>
</html>
`
}