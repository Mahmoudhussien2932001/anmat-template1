import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const port = 9360
const proc = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--autoplay-policy=no-user-gesture-required',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${process.env.TEMP}\\fm-vid-chrome3`,
  'about:blank',
], { detached: true, stdio: 'ignore' })
proc.unref()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let version
for (let i = 0; i < 50; i += 1) {
  try {
    version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()
    break
  } catch {
    await sleep(200)
  }
}
const ws = new WebSocket(version.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  ws.onopen = resolve
  ws.onerror = reject
})
let id = 0
const pending = new Map()
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
}
const send = (method, params = {}, sessionId) => new Promise((resolve) => {
  const next = ++id
  pending.set(next, resolve)
  ws.send(JSON.stringify({ id: next, method, params, sessionId }))
})

const target = await send('Target.createTarget', { url: 'about:blank' })
const session = await send('Target.attachToTarget', { targetId: target.result.targetId, flatten: true })
const sid = session.result.sessionId
await send('Page.enable', {}, sid)
await send('Runtime.enable', {}, sid)

async function extract(src, folder, step = 0.6) {
  mkdirSync(folder, { recursive: true })
  await send('Page.navigate', { url: 'http://127.0.0.1:8765/index2.html' }, sid)
  await sleep(800)
  const loaded = await send('Runtime.evaluate', {
    expression: `window.loadVideo(${JSON.stringify(src)})`,
    awaitPromise: true,
    returnByValue: true,
  }, sid)
  console.log('loaded', src, loaded.result?.result?.value)
  await sleep(400)
  const meta = JSON.parse((await send('Runtime.evaluate', {
    expression: 'JSON.stringify(window.__meta)',
    returnByValue: true,
  }, sid)).result.result.value)
  console.log(src, meta)
  const duration = Number(meta.duration) || 0
  for (let t = 0; t < duration; t += step) {
    const result = await send('Runtime.evaluate', {
      expression: `window.captureAt(${t})`,
      awaitPromise: true,
      returnByValue: true,
    }, sid)
    const value = result.result?.result?.value
    if (!value?.data?.startsWith('data:')) {
      console.log('fail', t, JSON.stringify(result.result))
      continue
    }
    const name = `t${t.toFixed(2).replace('.', 'p')}.jpg`
    writeFileSync(`${folder}\\${name}`, Buffer.from(value.data.split(',')[1], 'base64'))
    console.log(name, 'seekedTo', Number(value.t).toFixed(2), 'bytes', Buffer.from(value.data.split(',')[1], 'base64').length)
  }
}

await extract('/ref.mp4', 'C:\\Users\\Mahmoud.Hussien\\Desktop\\FranchiseMe-Web\\franchiseme\\tmp-ref\\v1', 0.7)
await extract('/ref2.mp4', 'C:\\Users\\Mahmoud.Hussien\\Desktop\\FranchiseMe-Web\\franchiseme\\tmp-ref\\v2', 0.7)
try { process.kill(proc.pid) } catch {}
process.exit(0)
