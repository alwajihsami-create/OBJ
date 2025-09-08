import React, { useMemo, useState, useEffect } from 'react'
import matter from 'gray-matter'
import { marked } from 'marked'

// Load all markdown posts at build time
const rawPosts = import.meta.glob('../posts/**/*.md', { as: 'raw', eager: true })
const posts = Object.entries(rawPosts).map(([path, raw]) => {
  const { data, content } = matter(raw)
  const slug = path.replace('../posts/', '').replace(/\.md$/, '')
  return { ...data, content, slug }
}).sort((a, b) => (new Date(b.date) - new Date(a.date)))

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()
  let page = 'home', slug = null
  const m = hash.match(/^#\/post\/(.+)$/)
  if (m) { page = 'post'; slug = decodeURIComponent(m[1]) }

  const current = posts.find(p => p.slug === slug)

  return (
    <div style={{ color: '#d9ffd9', background: '#0a0a0a', minHeight: '100vh', padding: 16 }}>
      <h1 style={{ color: '#99ff99' }}>OBJ</h1>
      <div style={{ marginBottom: 12 }}>
        <a href="#/">Home</a> &nbsp;|&nbsp; <a href="#/posts">Posts</a>
      </div>

      {page === 'home' && (
        <div>
          <h2 style={{ color: '#99ff99' }}>Latest Posts</h2>
          {posts.map(p => (
            <div key={p.slug} style={{ border: '1px solid #33ff33', padding: 12, marginTop: 8 }}>
              <a href={`#/post/${p.slug}`}><strong>{p.title}</strong></a>
              <div style={{ fontSize: 12, color: '#59ff59' }}>
                {new Date(p.date).toLocaleDateString()}
              </div>
              <div style={{ fontSize: 14 }}>{p.excerpt}</div>
            </div>
          ))}
        </div>
      )}

      {page === 'post' && current && (
        <div>
          <a href="#/posts" style={{ fontSize: 12, color: '#baffba' }}>← Back to posts</a>
          <h2 style={{ color: '#99ff99' }}>{current.title}</h2>
          <div style={{ fontSize: 12, color: '#59ff59' }}>
            {new Date(current.date).toLocaleDateString()}
          </div>
          <div
            className="prose prose-invert"
            dangerouslySetInnerHTML={{ __html: marked.parse(current.content) }}
          />
        </div>
      )}

      {page === 'post' && !current && <div>Post not found.</div>}
    </div>
  )
}
