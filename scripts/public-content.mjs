import path from 'node:path'
import sanitizeHtml from 'sanitize-html'

// Publication/review tooling keeps the complete archive; the website has one collection.
export function publicContent(content, { basePath = '' } = {}) {
  const byId = new Map(content.papers.map(paper => [paper.id, paper]))
  const byPath = new Map(content.papers.map(paper => [paper.note_path, paper]))
  const visible = new Set(content.papers.filter(paper => paper.inclusion === 'main').map(paper => paper.id))

  function noteTarget(href, current) {
    if (!href || href.startsWith('#')) return undefined
    let pathname = href.split(/[?#]/)[0]
    if (/^https?:\/\//i.test(href)) {
      const url = new URL(href)
      if (url.hostname === 'ciam-group.github.io' && url.pathname.startsWith('/awesome-nco/papers/')) {
        return byId.get(url.pathname.split('/').filter(Boolean).at(-1))
      }
      if (url.hostname !== 'github.com' || !url.pathname.startsWith('/CIAM-Group/awesome-nco/blob/main/')) return undefined
      pathname = url.pathname.slice('/CIAM-Group/awesome-nco/blob/main/'.length)
    }
    try { pathname = decodeURIComponent(pathname) } catch { return undefined }
    const detail = pathname.match(/^\/(?:awesome-nco\/)?papers\/([^/]+)\/?$/)
    if (detail) return byId.get(detail[1])
    if (!pathname.endsWith('.md')) return undefined
    return byPath.get(pathname.replace(/^\//, ''))
      ?? byPath.get(path.posix.normalize(path.posix.join(path.posix.dirname(current.note_path), pathname)))
  }

  return {
    ...content,
    papers: content.papers.filter(paper => visible.has(paper.id)).map(paper => ({
      ...paper,
      body_html: sanitizeHtml(paper.body_html, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          a: ['href', 'title', 'target', 'rel'],
          code: ['class'],
          div: ['class'],
          img: ['src', 'alt', 'title', 'loading'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        transformTags: {
          a: (tagName, attribs) => {
            const target = noteTarget(attribs.href, paper)
            if (!target) return { tagName, attribs }
            if (!visible.has(target.id)) return { tagName, attribs: { ...attribs, href: target.paper_url, target: '_blank', rel: 'noreferrer' } }
            const fragment = attribs.href?.includes('#') ? `#${attribs.href.split('#').slice(1).join('#')}` : ''
            return { tagName, attribs: { ...attribs, href: `${basePath}/papers/${target.id}${fragment}` } }
          },
        },
      }),
    })),
    relations: content.relations.filter(relation => visible.has(relation.citing) && visible.has(relation.cited)),
  }
}
