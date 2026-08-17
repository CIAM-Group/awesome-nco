export type Scope = 'specialist' | 'generalist'
export type Paradigm = 'constructive' | 'improvement' | 'constructive-improvement'
export type RelationKind = 'architecture' | 'learning' | 'search' | 'scope'

export interface PaperFigure {
  path: string
  alt: string
  caption: string
  source_url: string
}

export interface PaperAcceptance {
  date: string
  source_url: string
}

export interface Paper {
  id: string
  short_title: string
  title: string
  authors: string[]
  year: number
  date: string
  acceptance?: PaperAcceptance
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
  figure?: PaperFigure
  note_path: string
  body_html: string
}

export interface Relation {
  papers: [string, string]
  kind: RelationKind
  description: string
}

export interface RelationKindStyle {
  color: string
  width: number
  dash: number[]
  curvature: number
  marker: 'none' | 'opposed-triangles'
}

export interface CollectionData {
  version: number
  papers: Paper[]
  relations: Relation[]
}

export interface PaperFilters {
  query: string
  scope: string
  paradigm: string
  family: string
  year: string
}

export interface TimelineGroup {
  year: number
  papers: Paper[]
}
