
import Express = require('express')
export const app = Express()

import { render } from "../";
app.engine('.tsx',render())
app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.get('/',(req,res)=>res.render('staticHTMLRender',{ who:'express-tsx', title:'express-tsx' }))