require('./ts')
const { Compile } = require('../')
const compiler = new Compile({ project:__dirname })
const assert = require('assert')
const _ = require('lodash')
const ts = require('typescript')

describe('import test',()=>{
  
  it(`import loop`,async()=>{
    const file1 = require.resolve('./loop/a')
    const file2 = require.resolve('./loop/b')
    ;([file1,file2]).forEach(compiler.getScriptVersion)

    let imports1 = compiler.getImports(file1)
    let imports2 = compiler.getImports(file2)
    let difference = _.difference(imports1,imports2)
    assert(
      difference.length === 0
      ,
      `import loop fail , dirference is ${JSON.stringify(difference)}`
    )
  })

  it(`import directly`,async()=>{
    const file = require.resolve('./views')
    compiler.getScriptVersion(file)

    let imports = compiler.getImports(file)
    let importsWithoutTypes = compiler.getImportsWithoutTypes(file)
    assert(
      Array.isArray(imports)
      && Array.isArray(importsWithoutTypes)
      ,
      `Type of Compile.getImports(file) should be Array`,
    )
  })

  it(`import async`,async()=>{
    const file = require.resolve('./views/asyncImport')
    compiler.getScriptVersion(file)

    let imports = compiler.getImports(file)
    assert(
      imports.length > 1
      ,
      `import async fail, imports is ${JSON.stringify(imports)}`
    )
    assert(
      imports.length > 2
      ,
      `imports.length should be bigger than 2, but now is ${imports.length}`
    )
  })

  it('import deep path',async()=>{
    const file = require.resolve('./views/importDeep')    
    compiler.getScriptVersion(file)
    let imports = compiler.getImports(file)
    assert(
      imports.length > 1
      ,
      `imports.length should more than 1, but now it is ${JSON.stringify(imports)}`
    )
  })

})
describe('Compile test',()=>{

  const file = require.resolve('./views/importDeep.ts')
  compiler.getScriptVersion(file)
  
  it('getSourceMap',async()=>{

    compiler.compilerOptions.sourceMap = true
    let sourceMap1 = compiler.getSourceMap(file)
    assert(
      !!sourceMap1
      ,
      `that should has sourcemap , please check Compile compilerOptions`
    )

    compiler.compilerOptions.sourceMap = false
    let sourceMap2 = compiler.getSourceMap(file)
    assert(
      sourceMap2 === 'no sourceMap'
      ,
      `that should not has sourcemap , please check Compile compilerOptions`
    )

  })

  it(`getCompiledCode`,async()=>{
    compiler.compilerOptions.module = ts.ModuleKind.AMD
    compiler.compilerOptions.sourceMap = true
    let code1 = compiler.getCompiledCode(file)
    compiler.compilerOptions.sourceMap = false
    let code2 = compiler.getCompiledCode(file)
    assert(
      code1.indexOf(code2) === 0
      ,
      `Compile.getCompiledCode has error`
    )
  })

})
