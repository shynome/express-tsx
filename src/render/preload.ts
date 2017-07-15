import { data } from "./render";
export let preload = (data:data,preload_imports:string[])=>{
  let res = data.res
  res.setHeader('link',preload_imports.map(path=>`<${path}>; rel=preload; as=script`).join(','))
}