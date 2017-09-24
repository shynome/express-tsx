//@ts-check
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const ViewFile = './view.tsx'

const { expressTsx,expressTsxMiddleware } = require('../../')
const server = expressTsx(__dirname)
server.use(expressTsxMiddleware)
server.get('/',(req,res)=>res.render(ViewFile))
/**@type {Promise<string>} */
const url_promise = new Promise((rl,rj)=>{
  server
  //@ts-ignore
  .once('error',rj)
  .listen(function(){
    let url = `http://127.0.0.1:${this.address().port}`
    rl(url)
  })
})
//change view
const tpl = (word)=>`
import React = require('react')
export default <div id="text">${word}</div>
`
const rewriteView = (word,viewFile=ViewFile)=>{
  viewFile = path.join(server.get('views'),ViewFile)
  fs.writeFileSync(viewFile,tpl(word))
  return word
}
const { Chromeless } = require('chromeless')
describe('render test',()=>{
  /**
   * @param {string} word 
   * @return {Promise<string>}
   */
  async function testRenderTextRight(word){
    const chromeless = new Chromeless()
    let url = await url_promise
    rewriteView(word)
    let text = await chromeless.goto(url)
    .wait('#text')
    .evaluate(()=>{
      return document.getElementById('text').innerText
    })
    assert.equal(word,text,`render fail`)
    return text
  }
  it('base render',async()=>{
    let text1 = await testRenderTextRight('666')
    let text2 = await testRenderTextRight('777')
    assert.equal(text1===text2,false,'hot render fail')
  })
})
