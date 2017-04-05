
import *as express from 'express'
const app = express()

import { render,option } from '../'
app.engine('.tsx',render({ hotload:true }))
app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.get('/',(req,res)=>res.render('index',{html:`hello world`}))
app.get('/class',(req,res)=>res.render('class',{html:`hello world`}))

const port = 3000
app.listen(port,()=>{
  console.log(`Express started on port ${port}`)
})
