
import { Router } from "express";
export const app = Router()

import { middleware } from "express-tsx";
app.use(middleware)

import { app as staticHTMLRender } from "./staticHTMLRender";
app.use('/staticHTMLRender',staticHTMLRender)

import { app as ssrRender } from "./ssrRender";
app.use('/ssrRender',ssrRender)
app.use('/ssrRender/dddddd/ee',ssrRender)

import { app as deep } from "./deep";
app.use('/deep',deep)

app.use('/',(req,res)=>res.sendFile(__dirname+'/views/index.html'))
