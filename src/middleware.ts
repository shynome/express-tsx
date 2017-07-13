import { Router } from 'express'
export const middleware = Router()

import { renderMiddleware } from './render'
middleware.use(renderMiddleware)

import { compiler } from "./Compile";
middleware.use('/express-tsx',compiler.staticServer)
