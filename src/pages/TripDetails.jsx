import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../services/firebaseConfig';


export const TripDetails = () => {
  const tripId = useParams()
  const [trip, setTrip] = useState([])
  const navigate = useNavigate()
  const fetchTripData = async () => {
    const docRef = doc(db, "trips-ai", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTrip(docSnap.data())
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  useEffect(()=>{
    if(tripId){
      fetchTripData() 
    }
  },[tripId])
  return trip && (
    <div>
      <div>
        <div>
          <img src={'./private.png'} alt="" />
        </div>
      </div>
    </div>

  )
}
export default TripDetails