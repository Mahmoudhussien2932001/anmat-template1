import fs from 'fs'
const html = fs.readFileSync('references/FranchiseME-3D.html', 'utf8')
const start = html.indexOf('const opportunities=')
const end = html.indexOf('const sectors=')
let chunk = html.slice(start, end)
chunk = chunk.replace(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+/g, '"IMG"')
chunk = chunk.replace(/"IMG"/g, '"IMG"')
fs.writeFileSync('tmp-ref/opportunities-raw.js', chunk)
console.log('ops len', chunk.length)

const clients = html.indexOf('AS.clients')
const cStart = html.lastIndexOf('clients', clients)
console.log('clients idx', clients)
const as = html.indexOf('const AS=')
console.log('AS', as)
if (as > 0) {
  let slice = html.slice(as, as + 8000)
  slice = slice.replace(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+/g, '"IMG"')
  fs.writeFileSync('tmp-ref/as-raw.js', slice.slice(0, 4000))
  console.log(slice.slice(0, 1500))
}
