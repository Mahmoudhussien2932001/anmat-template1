import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const port = 9361
const proc = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--autoplay-policy=no-user-gesture-required',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${process.env.TEMP}\\fm-vid-chrome4`,
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

async function extract(src, folder, interval = 0.55) {
  mkdirSync(folder, { recursive: true })
  await send('Page.navigate', { url: 'http://127.0.0.1:8765/index2.html' }, sid)
  await sleep(700)
  await send('Runtime.evaluate', {
    expression: `window.loadVideo(${JSON.stringify(src)})`,
    awaitPromise: true,
  }, sid)
  const result = await send('Runtime.evaluate', {
    expression: `(() => new Promise(async (resolve) => {
      const v = document.getElementById('v')
      const c = document.getElementById('c')
      const ctx = c.getContext('2d')
      const frames = []
      let next = 0
      const interval = ${interval}
      v.playbackRate = 1
      const grab = () => {
        if (v.currentTime + 0.01 < next) return
        ctx.drawImage(v, 0, 0, c.width, c.height)
        frames.push({ t: v.currentTime, data: c.toDataURL('image/jpeg', 0.88) })
        next += interval
      }
      v.addEventListener('timeupdate', grab)
      v.addEventListener('ended', () => {
        grab()
        resolve(JSON.stringify({ count: frames.length, duration: v.duration, frames }))
      })
      try {
        await v.play()
      } catch (err) {
        resolve(JSON.stringify({ error: String(err), count: 0, frames: [] }))
      }
    }))()`,
    awaitPromise: true,
    returnByValue: true,
  }, sid)
  const payload = JSON.parse(result.result?.result?.value || '{"frames":[]}')
  console.log(src, 'count', payload.count, 'duration', payload.duration, 'error', payload.error || null)
  for (const frame of payload.frames || []) {
    const name = `t${Number(frame.t).toFixed(2).replace('.', 'p')}.jpg`
    writeFileSync(`${folder}\\${name}`, Buffer.from(frame.data.split(',')[1], 'base64'))
  }
}

await extract('/ref.mp4', 'C:\\Users\\Mahmoud.Hussien\\Desktop\\FranchiseMe-Web\\franchiseme\\tmp-ref\\v1p', 0.5)
await extract('/ref2.mp4', 'C:\\Users\\Mahmoud.Hussien\\Desktop\\FranchiseMe-Web\\franchiseme\\tmp-ref\\v2p', 0.5)
try { process.kill(proc.pid) } catch {}
process.exit(0)
