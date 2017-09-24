//@ts-check
const assert = require('assert')
const { Chromeless } = require('chromeless')
const { startServer, rewriteView:_rewriteView } = require('./')
const ViewFile = `./baseRender.view.tsx`
const rewriteView = _rewriteView(ViewFile)
rewriteView()

//base render test
const { expressTsx,expressTsxMiddleware } = require('../../')
const server = expressTsx(__dirname)
server.use(expressTsxMiddleware)
server.get('/',(req,res)=>res.render(ViewFile))
const url_promise = startServer(server)
/**
 * @param {string} word 
 * @return {Promise<string>}
 */
async function testRenderTextRight(word){
  const chromeless = new Chromeless()
  let url = await url_promise
  rewriteView(word)
  // need clear cache 
  let text = await chromeless.clearCache().goto(url)
  .wait('#text')
  .evaluate(()=>{
    return document.getElementById('text').innerText
  })
  assert.equal(word,text,`render fail`)
  
  return text
}
it('base render',async()=>{
  let text1 = await testRenderTextRight('666')
  await new Promise(rl=>setTimeout(rl,500))
  let text2 = await testRenderTextRight('777')
  assert.equal(text1===text2,false,'hot render fail')
})