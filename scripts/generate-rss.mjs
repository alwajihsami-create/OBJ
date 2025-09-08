// scripts/generate-rss.mjs
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const site = {
  title: 'OBJ',
  url: process.env.SITE_URL || 'https://example.netlify.app',
}

const postsDir = path.resolve('posts')
const files = fs.existsSync(postsDir)
  ? fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  : []

const entries = files.map(f => {
  const raw = fs.readFileSync(path.join(postsDir, f), 'utf-8')
  const { data, content } = matter(raw)
  const slug = f.replace(/\.md$/, '')
  return { ...data, content, slug }
}).sort((a, b) => (new Date(b.date) - new Date(a.date)))

const items = entries.map(p => `
  <item>
    <title>${escapeXml(p.title || 'Untitled')}</title>
    <link>${site.url}/#/post/${encodeURIComponent(p.slug)}</link>
    <guid>${site.url}/#/post/${encodeURIComponent(p.slug)}</guid>
    <pubDate>${new Date(p.date || Date.now()).toUTCString()}</pubDate>
    <description>${escapeXml(p.excerpt || '')}</description>
  </item>
`).join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${site.url}</link>
    <description>${escapeXml('OBJ feed')}</description>
    ${items}
  </channel>
</rss>`

const outDir = path.resolve('public')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'feed.xml'), rss, 'utf-8')

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, c => ({
    '<':'&lt;','>':'&gt;','&':'&amp;','\'':'&apos;','"':'&quot;',
  }[c]))
}
