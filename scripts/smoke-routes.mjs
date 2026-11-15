import {spawn} from 'node:child_process'
import {setTimeout as sleep} from 'node:timers/promises'

const port=3107,origin='http://127.0.0.1:'+port
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p',String(port)],{
 env:{...process.env,NEXT_PUBLIC_SUPABASE_URL:process.env.NEXT_PUBLIC_SUPABASE_URL||'https://example.supabase.co',
 NEXT_PUBLIC_SUPABASE_ANON_KEY:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'ci-publishable-placeholder'},
 stdio:['ignore','pipe','pipe']
})
let logs=''
server.stdout.on('data',chunk=>{logs+=String(chunk).slice(-500)})
server.stderr.on('data',chunk=>{logs+=String(chunk).slice(-500)})
async function request(path){
 return fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(12000)})
}
try{
 let reachable=false
 for(let attempt=0;attempt<35;attempt++){
  if(server.exitCode!==null)throw new Error('Next.js exited: '+logs.slice(-1000))
  try{const r=await request('/');if(r.status<500){reachable=true;break}}catch{}
  await sleep(250)
 }
 if(!reachable)throw new Error('Next.js never responded: '+logs.slice(-1200))
 const expected=[
  ['/',[200]],['/offers',[200]],['/contact',[200]],
  ['/suivi',[200]],['/espace-partenaire',[200]],
  ['/admin',[200]],['/widget',[200]],['/partenaires',[200]],
  ['/api/send-guide',[307,308]]
 ]
 let failed=0
 for(const [path,codes] of expected){
  try{
   const response=await request(path)
   const success=codes.includes(response.status)
   process.stdout.write((success?'PASS':'FAIL')+' '+path+' '+response.status+'\n')
   if(!success)failed++
  }catch(e){
   failed++;process.stderr.write('FAIL '+path+': '+String(e)+'\n')
  }
 }
 if(failed)throw new Error(failed+' route(s) did not pass HTTP smoke tests')
 process.stdout.write('Verified '+expected.length+' HTML/route endpoints without test leads.\n')
}finally{
 server.kill('SIGTERM')
 await sleep(300)
 if(server.exitCode===null)server.kill('SIGKILL')
}
