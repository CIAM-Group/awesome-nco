export type Scope = 'specialist' | 'generalist'
export type Paradigm = 'constructive' | 'improvement' | 'constructive-improvement'

export interface Paper {
  id: string
  short_title: string
  title: string
  authors: string[]
  year: number
  date: string
  venue: string
  paper_url: string
  arxiv_url?: string
  code_url?: string
  institutions: string[]
  scope: Scope
  paradigm: Paradigm
  problem_families: string[]
  problems: string[]
  summary: string
  note_path: string
  body_html: string
}

export interface CollectionData {
  version: number
  papers: Paper[]
}

export interface PaperFilters {
  query: string
  paradigm: string
  family: string
  year: string
}

export interface TimelineGroup {
  year: number
  papers: Paper[]
}
