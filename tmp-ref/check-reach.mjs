import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const out = 'tmp-ref/shots/reach'
await mkdir(out, { recursive: true })
const browser = await chromium.launch()

async function open(width, height, path, reduced = false) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:5173${path}`, { waitUntil: 'networkidle' })
  return { context, page }
}

async function shot(page, name) {
  const panel = page.locator('.reach-panel')
  await panel.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await panel.screenshot({ path: `${out}/${name}.png` })
}

const desktop = await open(1280, 900, '/ar')
await shot(desktop.page, 'ar-desktop')
const ar = await desktop.page.evaluate(() => {
  const stage = document.querySelector('.reach-stage')
  const svg = document.querySelector('.reach-svg')
  const routes = document.querySelectorAll('.reach-route').length
  const labels = [...document.querySelectorAll('.reach-label')].map((node) => node.textContent)
  const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  const dir = stage?.getAttribute('dir')
  const transform = getComputedStyle(svg).transform
  return { routes, labels, overflow, dir, transform, title: document.querySelector('.reach-panel h3')?.innerText }
})
await desktop.page.getByRole('option', { name: 'البحرين' }).click()
await desktop.page.waitForTimeout(200)
const bahrain = await desktop.page.locator('.reach-detail').innerText()
await desktop.page.locator('.reach-picks').focus()
await desktop.page.keyboard.press('ArrowDown')
await desktop.page.waitForTimeout(150)
const afterKey = await desktop.page.evaluate(() => ({
  selected: document.querySelector('.reach-picks button.is-selected')?.innerText,
  focus: document.activeElement?.innerText,
}))
await desktop.page.screenshot({ path: `${out}/ar-desktop-bahrain.png`, fullPage: false })
await desktop.page.locator('.reach-panel').screenshot({ path: `${out}/ar-desktop-selected.png` })
await desktop.context.close()

const english = await open(1280, 900, '/en')
await shot(english.page, 'en-desktop')
const en = await english.page.evaluate(() => ({
  title: document.querySelector('.reach-panel h3')?.innerText,
  lead: document.querySelector('.reach-lead')?.innerText,
  dir: document.documentElement.dir,
}))
await english.page.getByRole('option', { name: 'Riyadh office' }).click()
const office = await english.page.locator('.reach-detail').innerText()
await english.context.close()

const mobile = await open(390, 844, '/ar')
await shot(mobile.page, 'ar-mobile')
const mobileInfo = await mobile.page.evaluate(() => {
  const label = document.querySelector('.reach-label')
  const hidden = label ? getComputedStyle(label).display : 'missing'
  const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  const pick = document.querySelector('.reach-picks button')
  const box = pick.getBoundingClientRect()
  return { hidden, overflow, pickHeight: box.height, panelHeight: document.querySelector('.reach-panel').getBoundingClientRect().height }
})
await mobile.page.getByRole('option', { name: 'كان، فرنسا' }).click()
await mobile.page.locator('.reach-panel').screenshot({ path: `${out}/ar-mobile-cannes.png` })
await mobile.context.close()

const reduced = await open(1280, 900, '/ar', true)
await reduced.page.locator('.reach-panel').scrollIntoViewIfNeeded()
await reduced.page.waitForTimeout(300)
const reducedInfo = await reduced.page.evaluate(() => {
  const land = document.querySelector('.reach-land')
  const card = document.querySelector('.reach-panel')
  return {
    landOpacity: land ? getComputedStyle(land).opacity : null,
    cardOpacity: card ? getComputedStyle(card).opacity : null,
  }
})
await reduced.page.locator('.reach-panel').screenshot({ path: `${out}/ar-reduced.png` })
await reduced.context.close()

const investor = await open(1280, 900, '/ar')
await investor.page.getByRole('button', { name: /مستثمر|المستثمر/ }).click().catch(() => {})
await investor.page.waitForTimeout(400)
const rings = await investor.page.locator('.ring-visual').count()
const reachGone = await investor.page.locator('.reach-panel').count()
await investor.context.close()

console.log(JSON.stringify({ ar, bahrain, afterKey, en, office, mobileInfo, reducedInfo, rings, reachGone }, null, 2))
await browser.close()
