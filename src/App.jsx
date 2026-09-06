import React from 'react'
import Header from './components/shared/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import TripDetails from './pages/TripDetails'
import MyTrips from './pages/MyTrips'
import ProtectedRoute from './components/shared/ProtectedRoute'
import { Toaster } from 'sonner'

const App = () => {
  return (
    <>
      <Toaster />
      <Header />
      <Routes>
        {/* Public */}
        <Route path='/' element={<Home />} />

        {/* Protected — require login */}
        <Route path='/create-trip' element={
          <ProtectedRoute><CreateTrip /></ProtectedRoute>
        } />
        <Route path='/trips/:tripId' element={
          <ProtectedRoute><TripDetails /></ProtectedRoute>
        } />
        <Route path='/my-trips' element={
          <ProtectedRoute><MyTrips /></ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App