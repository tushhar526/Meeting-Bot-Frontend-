import { Routes, Route } from 'react-router-dom'
import { SignUpPage } from './pages/SignUpPage/SignUpPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { HomePage } from './pages/HomePage/HomePage'
import { MeetingsPage } from './pages/MeetingsPage/MeetingsPage'
import { RecordingsPage } from './pages/RecordingsPage/RecordingsPage'
import { AnalyticsPage } from './pages/AnalyticsPage/AnalyticsPage'
import { SettingsPage } from './pages/SettingsPage/SettingsPage'
import { AppLayout } from './components/AppLayout/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoutes/ProtectedRoutes'

function App() {
  return (
    <Routes>
      {/* ── Protected routes with shared layout ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/recordings" element={<RecordingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* ── Public routes ── */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App