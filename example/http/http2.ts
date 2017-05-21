import http2 = require('spdy')
import express = require('express')
import { readFileSync } from "fs";
import { join } from "path";
const agentOptions:http2.ServerOptions = {
  key:readFileSync(join(__dirname,'./certificate/localhost.key')),
  cert:readFileSync(join(__dirname,'./certificate/localhost_bundle.crt')),
}

import { app as main } from "../router";
export const app = express()
app.use(main)
export const server = http2.createServer(agentOptions,app as any)

import { https_PORT,log } from "../";
server.listen(https_PORT,()=>{
  log(`Http2 is running on ${https_PORT}`)
})