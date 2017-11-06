import path = require('path')
export const enum Vars {
  cdn = 'https://unpkg.com',
  node_modules = '/node_modules',
  express_tsx_path = '/express-tsx/',
  express_tsx_hotreload_path = '/express-tsx-hotreload/',
}
export const browserInitPath = path.join(__dirname,'../browser/init.ts')
export const deepForceUpdatePath = path.join(__dirname,'../browser/update.ts')
export const enum key {
  requirejsId = 'requirejsId',
  requirejs = 'requirejs',
  compiler = 'compiler',
  requirejsConfigStr = 'requirejsConfigStr',
  requirejsConfigJsPath = '/require.config.js',
  requirejsConfigJsPathWithHash = 'requirejsConfigJsPathWithHash',
}
export { Compile } from 'express-tsx-compiler'
import { Compile } from 'express-tsx-compiler'
export const compiler = new Compile()
export { middleware, expressTsxMiddleware } from './hooks'
export { requirejsConfig } from './require.config'
export { render } from './render'
export { expressTsx } from './expressTsx'