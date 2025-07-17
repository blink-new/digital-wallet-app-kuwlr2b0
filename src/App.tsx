import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { blink } from '@/blink/client'
import Dashboard from '@/components/Dashboard'
import SendMoney from '@/components/SendMoney'
import RequestMoney from '@/components/RequestMoney'
import AddMoney from '@/components/AddMoney'
import TransactionHistory from '@/components/TransactionHistory'
import Profile from '@/components/Profile'
import AdminPanel from '@/components/AdminPanel'
import LoadingScreen from '@/components/LoadingScreen'
import AuthScreen from '@/components/AuthScreen'
import RegistrationScreen from '@/components/RegistrationScreen'
import LandingPage from '@/components/LandingPage'
import AdminLogin from '@/components/AdminLogin'
import { MockDataStore } from '@/store/mockData'
import { User as UserType } from '@/types'

type AppMode = 'landing' | 'user-auth' | 'admin-auth' | 'user-app' | 'admin-app'

function App() {
  const [mode, setMode] = useState<AppMode>('landing')
  const [authUser, setAuthUser] = useState<any>(null)
  const [user, setUser] = useState<UserType | null>(null)
  const [adminUser, setAdminUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  useEffect(() => {
    if (mode === 'user-auth') {
      setLoading(true)
      const unsubscribe = blink.auth.onAuthStateChanged((state) => {
        setAuthUser(state.user)
        setLoading(state.isLoading)
        
        if (state.user) {
          // Check if user exists in our system
          const existingUser = MockDataStore.getUserByEmail(state.user.email || '')
          if (existingUser) {
            setUser(existingUser)
            setNeedsOnboarding(false)
            setMode('user-app')
          } else {
            // New user needs onboarding
            setNeedsOnboarding(true)
          }
        } else {
          setUser(null)
          setNeedsOnboarding(false)
        }
      })
      return unsubscribe
    }
  }, [mode])

  const handleOnboardingComplete = (userData: UserType) => {
    setUser(userData)
    setNeedsOnboarding(false)
    setMode('user-app')
  }

  const handleUserLogin = () => {
    setMode('user-auth')
  }

  const handleAdminLogin = () => {
    setMode('admin-auth')
  }

  const handleAdminAuthenticated = (admin: UserType) => {
    setAdminUser(admin)
    setMode('admin-app')
  }

  const handleBackToLanding = () => {
    setMode('landing')
    setAuthUser(null)
    setUser(null)
    setAdminUser(null)
    setNeedsOnboarding(false)
  }

  const handleLogout = () => {
    if (mode === 'user-app') {
      blink.auth.logout()
    }
    handleBackToLanding()
  }

  // Landing page - choose between user and admin login
  if (mode === 'landing') {
    return <LandingPage onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} />
  }

  // Admin authentication
  if (mode === 'admin-auth') {
    return (
      <AdminLogin 
        onBackToLanding={handleBackToLanding}
        onAdminAuthenticated={handleAdminAuthenticated}
      />
    )
  }

  // User authentication flow
  if (mode === 'user-auth') {
    if (loading) {
      return <LoadingScreen />
    }

    if (!authUser) {
      return <AuthScreen />
    }

    if (needsOnboarding) {
      return <RegistrationScreen authUser={authUser} onRegistrationComplete={handleOnboardingComplete} />
    }

    if (!user) {
      return <LoadingScreen />
    }
  }

  // Admin app
  if (mode === 'admin-app' && adminUser) {
    return (
      <div className="min-h-screen bg-background">
        <AdminPanel />
        <Toaster position="top-center" />
      </div>
    )
  }

  // User app
  if (mode === 'user-app' && user) {
    return (
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
            <Route path="/request" element={<RequestMoney />} />
            <Route path="/add-money" element={<AddMoney />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-center" />
        </div>
      </Router>
    )
  }

  // Fallback
  return <LoadingScreen />
}

export default App