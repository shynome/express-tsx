
import *as express from 'express'
const app = express()

import { __express } from '../'
app.engine('.tsx',__express)
app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.get('/',(req,res)=>res.render('index',{html:`hello world`}))
app.get('/class',(req,res)=>res.render('class',{html:`hello world`}))

const port = 3000
app.listen(port,()=>{
  console.log(`Express started on port ${port}`)
})
