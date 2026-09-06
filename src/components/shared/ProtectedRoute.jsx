import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

/**
 * ProtectedRoute — wraps any route that requires login.
 *
 * If the user is not authenticated (no "user" key in localStorage),
 * they are redirected to "/" with a state flag { openLogin: true }
 * so the landing page can auto-open the login dialog.
 *
 * Usage in App.jsx:
 *   <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation()

  const user = (() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  if (!user || !user.email) {
    // Redirect to home, carrying the intended destination so we can restore later
    return (
      <Navigate
        to="/"
        state={{ openLogin: true, from: location.pathname }}
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute

