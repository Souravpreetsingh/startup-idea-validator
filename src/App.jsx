import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AnalysisResults from './pages/AnalysisResults'
import Chat from './pages/Chat'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analysis" element={<AnalysisResults />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
