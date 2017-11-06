const { expressTsx } = require("..");
const server = expressTsx(__dirname)
server.listen(3000)
server.use((req,res,next)=>(res.locals.hotreload=true,next()))
server.use('/',(req,res)=>res.render('./a.tsx'))