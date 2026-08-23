import React from 'react'
import HotelCardItem from './HotelCardItem'

const Hotels = ({ hotels, destination }) => {
  if (!hotels || hotels.length === 0) return null

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          🏨 Recommended Hotels
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Hand-picked accommodations tailored to your budget and group.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <HotelCardItem key={index} hotel={hotel} destination={destination} />
        ))}
      </div>
    </section>
  )
}

export default Hotels
