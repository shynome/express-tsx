import express = require('express')
export const app = express()

import { render,compile } from 'express-tsx'
app.engine('.tsx',render({ssr:true}))
app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.use((req,res)=>res.render('index'))