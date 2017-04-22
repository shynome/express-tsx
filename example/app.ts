import Express = require('express')
export const app = Express()
import { render  } from '../'
app.engine('.tsx',render({ ssr:true }))
app.set('views',__dirname+'/views')
app.set('view engine','tsx')

app.use('/views',Express.static(__dirname+'/views'))
app.get('/',(req,res)=>res.render('index',{html:`hello 444~`}))
app.get('/class',(req,res)=>res.render('class',{html:`hello world`}))
