
import { Router } from "express";
export const app = Router()

import { app as staticHTMLRender } from "./staticHTMLRender";
app.use('/staticHTMLRender',staticHTMLRender)

import { app as ssrRender } from "./ssrRender";
app.use('/ssrRender',ssrRender)

app.use('/',(req,res)=>res.sendFile(__dirname+'/views/index.html'))