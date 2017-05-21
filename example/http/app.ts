import express = require('express')
export const app = express()

import { app as router } from "../router";
app.use(router)
import { PORT } from "../";
app.listen(PORT,()=>{
  console.log(`server is running on ${PORT}`)
})