import { ArrowRight, BookOpenText, Layers3, SearchCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { PaperCard } from '../components/PaperCard'
import { papers, papersForScope, scopeDescriptions, sortPapersByFirstPublicNewestFirst } from '../lib/data'

export function HomePage() {
  const specialistCount = papersForScope('specialist').length
  const generalistCount = papersForScope('generalist').length
  const latest = sortPapersByFirstPublicNewestFirst(papers).slice(0, 3)

  return (
    <div className="home-page">
      <PageMeta title="Research Index" description="A structured research index for neural combinatorial optimization." />
      <section className="home-hero page-shell">
        <div className="home-hero__copy">
          <p className="eyebrow">Neural combinatorial optimization</p>
          <h1>A focused index of neural solvers.</h1>
          <p className="home-hero__lede">Browse structured research notes across specialist and generalist neural solvers, with a consistent taxonomy and evidence-aware summaries.</p>
          <div className="home-hero__actions">
            <Link to="/specialist">Explore specialist solvers <ArrowRight size={15} aria-hidden="true" /></Link>
            <Link to="/generalist">Explore generalist solvers <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
        <dl className="collection-stats" aria-label="Collection statistics">
          <div><dt>Curated papers</dt><dd>{papers.length}</dd></div>
          <div><dt>Specialist</dt><dd>{specialistCount}</dd></div>
          <div><dt>Generalist</dt><dd>{generalistCount}</dd></div>
        </dl>
      </section>

      <section className="scope-overview page-shell" aria-labelledby="browse-title">
        <header className="section-heading">
          <p className="eyebrow">Browse the collection</p>
          <h2 id="browse-title">Two scopes, one consistent reading format.</h2>
        </header>
        <div className="scope-grid">
          <Link className="scope-panel scope-panel--specialist" to="/specialist">
            <span>01</span>
            <h3>Specialist Neural Solvers</h3>
            <p>{scopeDescriptions.specialist}</p>
            <strong>{specialistCount} paper{specialistCount === 1 ? '' : 's'} <ArrowRight size={15} aria-hidden="true" /></strong>
          </Link>
          <Link className="scope-panel scope-panel--generalist" to="/generalist">
            <span>02</span>
            <h3>Generalist Neural Solvers</h3>
            <p>{scopeDescriptions.generalist}</p>
            <strong>{generalistCount} paper{generalistCount === 1 ? '' : 's'} <ArrowRight size={15} aria-hidden="true" /></strong>
          </Link>
        </div>
      </section>

      <section className="project-highlights page-shell" aria-labelledby="highlights-title">
        <header className="section-heading">
          <p className="eyebrow">Highlights</p>
          <h2 id="highlights-title">Designed for reading and maintaining research.</h2>
        </header>
        <div className="highlight-grid">
          <article><Layers3 size={21} aria-hidden="true" /><h3>Clear taxonomy</h3><p>Scope and solver paradigm are defined once and applied consistently across the collection.</p></article>
          <article><BookOpenText size={21} aria-hidden="true" /><h3>Structured notes</h3><p>Every paper follows the same path from motivation and method to experiments and limitations.</p></article>
          <article><SearchCheck size={21} aria-hidden="true" /><h3>Source-driven</h3><p>Machine-readable metadata powers search, timelines, detail pages, and repository indexes.</p></article>
        </div>
      </section>

      <section className="latest-papers page-shell" aria-labelledby="latest-title">
        <header className="section-heading section-heading--inline">
          <div><p className="eyebrow">Latest additions</p><h2 id="latest-title">Recently public work</h2></div>
          <Link to="/specialist">Browse timelines <ArrowRight size={15} aria-hidden="true" /></Link>
        </header>
        <div className="latest-grid">
          {latest.map((paper) => <PaperCard paper={paper} compact key={paper.id} />)}
        </div>
      </section>
    </div>
  )
}
