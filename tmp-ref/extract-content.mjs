import fs from 'fs'

let html = fs.readFileSync('references/FranchiseME-3D.html', 'utf8')
html = html.replace(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+/g, '"IMG"')
const a = html.indexOf('const sectors=')
const b = html.indexOf('function scene3d')
const chunk = html.slice(a, b)
fs.writeFileSync('tmp-ref/content-readable.js', chunk)
console.log('len', chunk.length)
