export { Compile } from "express-tsx-compiler";
import path = require('path')
export const browserInitPath = path.join(__dirname,'../browser/init.ts')
export const deepForceUpdatePath = path.join(__dirname,'../browser/update.ts')
export { renderWithCache as render }
export const enum key {
  requirejsId = 'requirejsId',
  requirejs = 'requirejs',
  compiler = 'compiler',
  compilerId = 'compilerId',
  requirejsConfig = 'requirejsConfig',
  requirejsConfigStr = 'requirejsConfigStr',
  requirejsConfigJsPath = '/require.config.js',
  requirejsConfigJsPathWithHash = 'requirejsConfigJsPathWithHash',
}
export const enum Vars {
  cdn = 'https://unpkg.com',
  node_modules = '/node_modules',
  express_tsx_path = '/express-tsx/',
  express_tsx_hotreload_path = '/express-tsx-hotreload/',
}

import './render'
export const cacheDir = path.join(process.cwd(),'./.express-tsx-cache')
import { renderWithCache } from "./cache";
require('consolidate')['tsx'] = renderWithCache

export { expressTsx } from './expressTsx'