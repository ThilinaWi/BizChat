import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'
import CompleteProfile from './pages/CompleteProfile'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import MyBookingsPage from './pages/MyBookingsPage'
import ManagerDashboardPage from './pages/ManagerDashboardPage'
import AdminPanelPage from './pages/AdminPanelPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/manager" element={<ManagerDashboardPage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
      </Routes>
    </Router>
  )
}

export default App