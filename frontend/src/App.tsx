import { useEffect } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Brand } from './components/Brand'
import { useStore } from './lib/store'
import DemoApp from './demo/DemoApp'
import Setup from './pages/Setup'
import Matches from './pages/Matches'
import MatchDetail from './pages/MatchDetail'
import MyRide from './pages/MyRide'

// "/" is the guided demo for judges. The fuller app screens (backup driver,
// check-in, near misses) stay available under /setup, /matches and /ride.

function Header() {
  const { profile } = useStore()
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="logo" aria-label="Routemate demo">
          <Brand decorative />
        </Link>
        {profile && (
          <nav className="app-nav" aria-label="Main">
            <NavLink to="/matches">Matches</NavLink>
            <NavLink to="/ride">My ride</NavLink>
          </nav>
        )}
      </div>
    </header>
  )
}

function Footer() {
  const { profile, reset } = useStore()
  const navigate = useNavigate()
  if (!profile) return null
  return (
    <footer className="page" style={{ paddingTop: 0, alignItems: 'center' }}>
      <button
        type="button"
        className="btn btn--ghost btn--sm"
        onClick={() => {
          reset()
          navigate('/setup/rider')
        }}
      >
        Reset
      </button>
    </footer>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<DemoApp />} />
        <Route element={<AppLayout />}>
          <Route path="/setup/:role" element={<Setup />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/ride" element={<MyRide />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
