export type Scope = 'specialist' | 'generalist' | 'study'
export type PaperType = 'solver' | 'theory' | 'benchmark' | 'analysis' | 'survey'
export type Paradigm = 'constructive' | 'improvement' | 'constructive-improvement' | 'neurodynamic'
export type RelationKind = 'citation'
export type Inclusion = 'main' | 'reference'
export type ReviewStatus = 'pending' | 'reading' | 'verified' | 'blocked'

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
  publication?: PaperAcceptance
  paper_type: PaperType
  venue: string
  paper_url: string
  arxiv_url?: string
  code_url?: string
  institutions: string[]
  inclusion: Inclusion
  inclusion_reason?: string
  review_status: ReviewStatus
  scope: Scope
  paradigm?: Paradigm
  problem_families: string[]
  problems: string[]
  summary: string
  figure?: PaperFigure
  note_path: string
  body_html: string
}

export interface Relation {
  citing: string
  cited: string
  reference_label: string
  evidence: { source_id: string; pdf_pages: number[]; locator: string; source_url?: string; archive_member?: string }[]
  // Derived endpoint pair; its order is citing -> cited.
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
  type?: string
  inclusion?: string
}

export interface TimelineGroup {
  year: number
  papers: Paper[]
}
