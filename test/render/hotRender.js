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
  let triggerWords = ['666','777','888','9']

  async function triggerHotreloadByUseWord(/**@type {string}*/word){
    rewriteView(word);
    /**@type {string} */
    let text = await chromeless.wait('#text').evaluate(getText)
    assert.equal(text, word, "render fail");
    //clear
    let x = await chromeless.evaluate(()=>{
      document.getElementById('app').innerHTML = ''
      return document.getElementById('app').innerHTML
    })
    return text
  }
  let index = 0
  let lastText = /**@type {string} */(null)
  for(let word of triggerWords){
    index++
    let text = await triggerHotreloadByUseWord(word)
    assert.equal(lastText===text,false,`the ${index} time hot render test fail. \r\n lastText:${lastText},now text:${text}`)
    lastText = text
  }
})
