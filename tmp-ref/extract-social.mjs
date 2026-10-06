import fs from 'fs'
const html = fs.readFileSync('references/FranchiseME-3D.html', 'utf8')
const start = html.indexOf('linkedin.com')
console.log(html.slice(start - 40, start + 180))
const ig = html.indexOf('instagram.com')
console.log('IG', html.slice(ig - 20, ig + 120))
