import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hero from '../components/shared/Hero'
import LoginDialog from '../components/shared/LoginDialog'

const Home = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [openLogin, setOpenLogin] = useState(false)

  // If redirected from a ProtectedRoute, auto-open the login dialog
  useEffect(() => {
    if (location.state?.openLogin) {
      setOpenLogin(true)
      // Clear the state so refreshing Home doesn't re-open the dialog
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleLoginSuccess = () => {
    setOpenLogin(false)
    // Navigate to the page they were trying to reach
    const intended = location.state?.from
    if (intended && intended !== '/') {
      navigate(intended)
    }
  }

  return (
    <>
      <Hero />
      <LoginDialog
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}

export default Home