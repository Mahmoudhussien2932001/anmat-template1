import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const out = 'tmp-ref/shots/motion'
await mkdir(out, { recursive: true })

const browser = await chromium.launch()

async function scrollPage(page) {
  const height = await page.evaluate(() => document.scrollingElement.scrollHeight)
  for (let y = 0; y < height; y += 420) {
    await page.mouse.wheel(0, 420)
    await page.waitForTimeout(90)
  }
  await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight))
  await page.waitForTimeout(900)
}

async function inspect(page) {
  return page.evaluate(() => {
    const hidden = [...document.querySelectorAll('h1, h2, h3, p, .button, .dashboard-preview, .price-card, .glass-card')]
      .filter((node) => getComputedStyle(node).opacity === '0' || getComputedStyle(node).visibility === 'hidden')
      .slice(0, 8)
      .map((node) => node.tagName + ' ' + (node.innerText || '').slice(0, 40))
    const clipped = [...document.querySelectorAll('.mask-line')].filter((node) => {
      const inner = node.querySelector('.mask-line-inner')
      if (!inner) return false
      return inner.scrollHeight > node.clientHeight + 4
    }).map((node) => node.innerText.slice(0, 48))
    const hero = document.querySelector('h1')?.innerText ?? ''
    const lines = document.querySelectorAll('h1 .mask-line').length
    const triggers = window.ScrollTrigger?.getAll?.().length ?? 'no-global'
    return { hidden, clipped, hero, lines, triggers, dir: document.documentElement.dir }
  })
}

async function pass(name, width, height, path, extra) {
  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: { dir: out, size: { width, height } },
  })
  const page = await context.newPage()
  await page.addInitScript(() => {
    window.ScrollTrigger = window.ScrollTrigger
  })
  await page.goto(path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const before = await inspect(page)
  await page.screenshot({ path: `${out}/${name}-top.png` })
  await page.locator('#projects, .pricing-grid, .contact-layout, .op-list').first().scrollIntoViewIfNeeded().catch(() => {})
  await page.waitForTimeout(120)
  await page.screenshot({ path: `${out}/${name}-mid.png` })
  await scrollPage(page)
  const after = await inspect(page)
  await page.screenshot({ path: `${out}/${name}-end.png` })
  if (extra) await extra(page)
  const video = page.video()
  await context.close()
  const videoPath = video ? await video.path() : ''
  console.log(JSON.stringify({ name, before, after, videoPath }))
}

await pass('ar-desktop', 1440, 900, 'http://127.0.0.1:5173/ar')
await pass('en-desktop', 1440, 900, 'http://127.0.0.1:5173/en', async (page) => {
  await page.goto('http://127.0.0.1:5173/en', { waitUntil: 'networkidle' })
  await page.getByRole('tab', { name: 'I am an investor' }).click()
  await page.waitForTimeout(700)
  const hero = await page.locator('h1').innerText()
  console.log('investor-hero', hero)
  await page.goto('http://127.0.0.1:5173/en/knowledge', { waitUntil: 'networkidle' })
  await scrollPage(page)
  await page.goto('http://127.0.0.1:5173/ar/opportunities', { waitUntil: 'networkidle' })
  await page.locator('#sector').click()
  await page.waitForTimeout(200)
  const menu = await page.locator('#sector-list').isVisible()
  console.log('menu-open', menu)
})
await pass('ar-mobile', 390, 844, 'http://127.0.0.1:5173/ar')
await pass('en-mobile', 390, 844, 'http://127.0.0.1:5173/en')

const reduced = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
const still = await reduced.newPage()
await still.goto('http://127.0.0.1:5173/ar', { waitUntil: 'networkidle' })
await still.waitForTimeout(400)
const reducedInfo = await inspect(still)
console.log('reduced', JSON.stringify(reducedInfo))
await reduced.close()
await browser.close()
