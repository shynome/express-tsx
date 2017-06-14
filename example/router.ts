
import { Router } from "express";
export const app = Router()

import { middleware } from "../src";
app.use(middleware)

import { app as staticHTMLRender } from "./staticHTMLRender";
app.use('/staticHTMLRender',staticHTMLRender)

import { app as ssrRender } from "./ssrRender";
app.use('/ssrRender',ssrRender)

import { app as deepPathTest } from "./deepPath.test";
app.use('/deepPath',Router().use('/test',deepPathTest))

app.use('/',(req,res)=>res.sendFile(__dirname+'/views/index.html'))
