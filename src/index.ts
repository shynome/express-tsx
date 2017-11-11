export { Compile } from "express-tsx-compiler";
import path = require('path')
export const browserInitPath = path.join(__dirname,'../browser/init.ts')
export const deepForceUpdatePath = path.join(__dirname,'../browser/update.ts')
import './render'
export const cacheDir = path.join(process.cwd(),'./.express-tsx-cache')
import { renderWithCache } from "./cache";
require('consolidate')['tsx'] = renderWithCache
export { renderWithCache as render }