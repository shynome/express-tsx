import express = require('express')
export const app = express()

import { app as router } from "../router";
app.use(router)