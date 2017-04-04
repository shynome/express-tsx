# description
如果你用 typescript 来写一个 express 应用 , 并且想使用 typescript react 来渲染页面的话 , 你可能需要这个包

# install

```shell
npm install express-tsx --save
```

# code

```typescript

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

```

[源码在这](./example/index.ts)


ps: 如果你有什么好的建议 , 记得发 issue 哦
