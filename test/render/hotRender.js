//@ts-check
const assert = require('assert')
const { Chromeless } = require('chromeless')
const { startServer, rewriteView:_rewriteView, } = require('./')
const ViewFile = `./hotRender.view.tsx`
const rewriteView = _rewriteView(ViewFile)
rewriteView()

//hot render test
const { expressTsx,expressTsxMiddleware } = require('../../')
const server = expressTsx(__dirname)
server.use(expressTsxMiddleware)
server.use((req,res,next)=>{
  res.locals.hotreload = true //open hot reload
  next()
})
server.get('/',(req,res)=>res.render(ViewFile))
const url_promise = startServer(server)
it('hot render',async()=>{
  const chromeless = new Chromeless()
  let url = await url_promise
  await chromeless.goto(url)
  function getText(){
    return document.getElementById('text').innerText
  }
  let word1 = '666', word2 = '777'

  rewriteView(word1)
  let text1 = await chromeless.wait('#text').evaluate(getText)
  assert.equal(text1,word1,'render fail')

  //clear
  let x = await chromeless.evaluate(()=>{
    document.getElementById('app').innerHTML = ''
    return document.getElementById('app').innerHTML
  })

  rewriteView(word2)
  let text2 = await chromeless.wait('#text').evaluate(getText)
  assert.equal(text2,word2,'render fail')    

  assert.equal(text1===text2,false,`hot render fail`)

  await chromeless.end()
})
