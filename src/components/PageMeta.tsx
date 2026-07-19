import { useEffect } from 'react'

interface PageMetaProps {
  title: string
  description: string
}

export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = `${title} · Awesome NCO`
    const element = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (element) element.content = description
  }, [description, title])

  return null
}
