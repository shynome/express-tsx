
import express = require('express')
const app = express()

export const port = 3000
app.listen(port,()=>{
  console.log(`Express started on port ${port}`)
})

import { app as router } from "./router";
app.use(router)
