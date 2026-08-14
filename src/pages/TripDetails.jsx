import React from 'react'
import { useParams } from 'react-router-dom'

const TripDetails = () => {
    const tripId = useParams() 
  return (
    <div>TripDetails Page and tripId is: {tripId}</div>
  )
}

export default TripDetails