
import Express = require('express')
export const app = Express()

import { render } from "../";
app.engine('.tsx',render({ ssr:true }))
app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.get('/',(req,res)=>res.render('ssrRender',{ who:'express-tsx', title:'express-tsx' }))