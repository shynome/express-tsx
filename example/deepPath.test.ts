import express = require('express')
export const app = express()

import { middleware,render } from "../src";
app.use(middleware)
app.engine('.tsx',render())
app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.use((req,res)=>res.render('ssrRender'))