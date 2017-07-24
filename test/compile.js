const { Compile } = require('../')
const compiler = new Compile()
const assert = require('assert')
const _ = require('lodash')
const ts = require('typescript')
const path = require('path')

describe('import test',()=>{
  
  it(`import loop`,async()=>{
    const file1 = path.join(__dirname,'./loop/a.ts').replace(/\\/g,'/')
    const file2 = path.join(__dirname,'./loop/b.ts').replace(/\\/g,'/')
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
    const file = path.join(__dirname,'./views/index.tsx')
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
    const file = path.join(__dirname,'./views/asyncImport.ts')
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
    const file = path.join(__dirname,'./views/importDeep.ts')    
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

  const file = path.join(__dirname,'./views/importDeep.ts')
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
