import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pagination, scrollToListing } from './pagination'

export function usePagination<T>(items: T[], targetId: string) {
  const [params, setParams] = useSearchParams()
  const state = pagination(items.length, params.get('page'))
  useEffect(() => {
    if (!params.has('page') || params.get('page') === String(state.page)) return
    setParams(previous => {
      const next = new URLSearchParams(previous)
      if (state.page === 1) next.delete('page')
      else next.set('page', String(state.page))
      return next
    }, { replace: true })
  }, [params, setParams, state.page])
  function onChange(page: number) {
    setParams(previous => {
      const next = new URLSearchParams(previous)
      if (page === 1) next.delete('page')
      else next.set('page', String(page))
      return next
    })
    scrollToListing(targetId)
  }
  return { ...state, items: items.slice(state.start, state.end), onChange }
}
