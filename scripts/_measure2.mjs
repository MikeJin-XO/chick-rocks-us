const t = await (await fetch(`http://localhost:9342/json/new?http://localhost:5180/catering`,{method:"PUT"})).json();
const ws=new WebSocket(t.webSocketDebuggerUrl); let id=0; const p=new Map();
const send=(m,pa={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:pa}));});
ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id);}});
await new Promise(r=>ws.addEventListener("open",r));
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
await send("Page.navigate",{url:"http://localhost:5180/catering"});
await new Promise(r=>setTimeout(r,4800));
const expr=`(()=>{
  const sec=document.querySelectorAll('section')[0];
  const box=sec.querySelector('.aspect-square');
  const rb=box.getBoundingClientRect();
  const imgs=[...sec.querySelectorAll('img')].filter(i=>i.src.includes('/cutouts/'));
  const out=imgs.map(i=>{const r=i.getBoundingClientRect();return {src:i.src.split('/').pop(),top:Math.round(r.top),h:Math.round(r.height),left:Math.round(r.left),w:Math.round(r.width)};});
  return JSON.stringify({box:{top:Math.round(rb.top),h:Math.round(rb.height),left:Math.round(rb.left),w:Math.round(rb.width)}, imgs:out},null,1);
})()`;
const r=await send("Runtime.evaluate",{expression:expr,returnByValue:true});
console.log(r.result.value); ws.close();
