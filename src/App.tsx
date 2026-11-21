import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AskFeedback from './pages/AskFeedback'
import DailyDigest from './pages/DailyDigest'
import Evals from './pages/Evals'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <div className="min-h-screen" style={{ background: '#F3EADE' }}>
      {!isLanding && <Nav />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/ask" element={<PageWrapper><AskFeedback /></PageWrapper>} />
          <Route path="/digest" element={<PageWrapper><DailyDigest /></PageWrapper>} />
          <Route path="/evals" element={<PageWrapper><Evals /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
