import React from 'react'
import Header from './components/shared/Header'
import { Route ,Routes} from 'react-router-dom'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import TripDetails from './pages/TripDetails'
import { Toaster } from 'sonner'

const App = () => {
  return (
    <>
    <Toaster />
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create-trip' element={<CreateTrip />}></Route>
        <Route path='/trips/:tripId' element={<TripDetails />}></Route>        
      </Routes>
    </>
  )
}

export default App