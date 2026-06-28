import React, { useState } from 'react'

const CreateTrip = () => {
  const [step, setstep] = useState(1)
  const [loading, setloading] = useState(false)
  const [formData, setformData] = useState({
    destination: null,
    noOfDays: '',
    traveler: '',
    budget: '',
  })

  //Planner Form view
  return (
    <div className='max-padd-container flexCenter pt-18 h-screen'>
      {/* Container */}
      <div className='w-full max-w-3xl min-h-[86vh] sm:min-h-[80vh] bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col'>
      {/* Progress Bar */}
        <div className='h-2 bg-indigo-100 w-full'>
            <div className='h-full bg-indigo-600 transition-all duration-500 ease-out' 
            style={{width:`${(step/3)* 100}%`}}/>
        </div>
        <div className='p-5 md:p-12 flex felx-col flex-1'>
          {/* Steps indicators*/}
          <div>
            <div />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTrip