import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Careers from './pages/Careers'
import Roadmap from './pages/Roadmap'
import Foundation from './pages/Foundation'
import Learn from './pages/Learn'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import AskAnything from './pages/AskAnything'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="careers" element={<Careers />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="foundation" element={<Foundation />} />
        <Route path="learn/:conceptId" element={<Learn />} />
        <Route path="projects" element={<Projects />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ask" element={<AskAnything />} />
      </Route>
    </Routes>
  )
}

export default App
