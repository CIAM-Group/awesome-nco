import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { CollectionPage } from './pages/CollectionPage'
import { HomePage } from './pages/HomePage'
import { PaperDetailPage } from './pages/PaperDetailPage'
import { PapersPage } from './pages/PapersPage'
import { RelationsPage } from './pages/RelationsPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/specialist" element={<CollectionPage scope="specialist" />} />
          <Route path="/generalist" element={<CollectionPage scope="generalist" />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/relations" element={<RelationsPage />} />
          <Route path="/papers/:id" element={<PaperDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
