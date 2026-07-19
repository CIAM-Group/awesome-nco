import { Github } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Awesome NCO home">
        <strong>Awesome NCO</strong>
        <small>Research Index</small>
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        <NavLink to="/specialist" className={({ isActive }) => isActive ? 'is-active' : undefined}>Specialist</NavLink>
        <NavLink to="/generalist" className={({ isActive }) => isActive ? 'is-active' : undefined}>Generalist</NavLink>
      </nav>
      <a
        className="github-link"
        href="https://github.com/CIAM-Group/awesome-nco"
        target="_blank"
        rel="noreferrer"
        aria-label="Open the Awesome NCO GitHub repository"
        title="GitHub repository"
      >
        <Github size={18} strokeWidth={1.7} aria-hidden="true" />
      </a>
    </header>
  )
}
