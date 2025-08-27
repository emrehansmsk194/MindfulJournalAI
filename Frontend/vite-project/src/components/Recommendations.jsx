import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import authService from '../services/authService'
import apiClient from '../services/apiClient'
import './recommendations.css'

const Recommendations = () => {
  const[data, setData] = useState([]);
  const [error,setError] = useState('');
  const [recommendation,setRecommendation] = useState([]);
  const [personal,setPersonal] = useState([]);
  const [lastEntry, setLastEntry] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [allEntries, setAllEntries] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('');

  const fetchData = async () => {
    try{
        const response = await apiClient.get('Recommendation/target-mood');
        console.log("All Response: ",response);
        const finalData = response.data || response;
        setData(finalData);
    }
    catch(error) {
        setError(error.message);
    }
  }
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(),
        fetchPersonalRecommendations(),
        fetchAllRecommendations()
      ]);
    };
    fetchAllData();
  }, []);

  const fetchAllRecommendations = async () => {
    try{
        const responseRecommendation = await apiClient.get('Recommendation');
        const finalRecommendation = responseRecommendation.data || responseRecommendation;
        setRecommendation(finalRecommendation);
        finalRecommendation.forEach((element) => defineScheduleType(element.schedulingType));

    }
    catch(error) {
        setError(error.message);
    }
  }
  const fetchPersonalRecommendations = async () => {
    try{
        const responsePersonal = await apiClient.get('Recommendation/personalized');
        const personalRecommendation = responsePersonal.data || responsePersonal;
        setPersonal(personalRecommendation);
        personalRecommendation.forEach((element) => defineScheduleType(element.schedulingType));
        
    }
    catch(error) {
        setError(error.message);
    }
  }


  const defineScheduleType = (schedulingType) => {
    switch(schedulingType) {
        case "acil":
            return "#FF0000";
        case "haftalık":
            return "#2513f0ff";
        case "günlük":
            return "#1E8013";
        default:
            return "#000000";
    }
  }

   const uniqueMoods = [...new Set(recommendation.map(rec => rec.targetMood))];



  return (
    <div>
        <Navbar />
        
        <div className='btn-container'>
            <button 
                className={`button ${lastEntry ? 'active' : ''}`} 
                onClick={() => { setLastEntry(true); setAllEntries(false); setWeekly(false);}}>
                Son Günlüğüne Özel
            </button>
            <button 
                className={`button ${weekly ? 'active' : ''}`} 
                onClick={() => {setLastEntry(false); setWeekly(true); setAllEntries(false);}}>
                Haftalık
            </button>
            <button 
                className={`button ${allEntries ? 'active' : ''}`} 
                onClick={() => {setLastEntry(false); setWeekly(false); setAllEntries(true);}}>
                Tüm Öneriler
            </button>
        </div>
        
        {lastEntry &&
        <div className='recommendation-container'>
             <h1 style={{textAlign:"center"}}>Son Günlüğüne Özel Öneriler</h1>
            {
                data.map((recommendation,index) => (
                    <div key={index} className='recommendation-section'>
                        <div className='items-1'>
                             <h3>{recommendation.name}</h3>
                             <p>{recommendation.time} Dakika</p>
                        </div>
                        <p style={{fontSize:"0.9rem"}}>{recommendation.longDescription}</p>
                        <div className='items-2'>
                        <p> <strong>Hedef Ruh Hali:</strong> {recommendation.targetMood}</p>
                        <div className='scheduling-item' style={{borderColor: defineScheduleType(recommendation.schedulingType)}}>
                             <p><strong style={{color: defineScheduleType(recommendation.schedulingType)}}>{recommendation.schedulingType}</strong></p>
                        </div>
                        </div>
                        
                    </div>
                ))
            }
        </div>
     }
     {weekly &&
     <div className='recommendation-container'>
        <h1 style={{textAlign:"center"}}>Haftalık Öneriler</h1>
        {
            personal.map((recommendation,index) => (
                <div key={index} className='recommendation-section'>
                    <div className='items-1'>
                        <h3>{recommendation.name}</h3>
                        <p>{recommendation.time} Dakika</p>
                    </div>
                     <p style={{fontSize:"0.9rem"}}>{recommendation.longDescription}</p>
                     <div className='items-2'>
                     <p> <strong>Hedef Ruh Hali:</strong> {recommendation.targetMood}</p>
                     <div className='scheduling-item' style={{borderColor: defineScheduleType(recommendation.schedulingType)}}>
                         <p><strong style={{color: defineScheduleType(recommendation.schedulingType)}}>{recommendation.schedulingType}</strong></p>
                     </div>
                     </div>

                </div>
            ))
        }
        
    </div>

     }
 { allEntries &&
 (() => {
    const filteredRecommendations = selectedEmotion === '' 
      ? recommendation 
      : recommendation.filter(rec => rec.targetMood === selectedEmotion);
    return (
      <div className='all-recommendations'>
      <div>
        <select
        value={selectedEmotion}
        onChange={e => setSelectedEmotion(e.target.value)}
        className='emotion-dropdown'
        >
        <option value=''>Tümü</option>
        {uniqueMoods.map(mood => (
          <option key={mood} value={mood}>
          {mood}
          </option>
        ))}
        </select>
      </div>
      {
        filteredRecommendations.map((reco,index) => (
          <div key={index} className='recommendation-section-v2'>
            <div className='items-1'>
              <h3>{reco.name}</h3>
              <p>{reco.time} Dakika</p>
            </div>
            <p style={{fontSize:"0.9rem"}}>{reco.longDescription}</p>
            <div className='items-2'>
            <p> <strong>Hedef Ruh Hali:</strong> {reco.targetMood}</p>
            <div className='scheduling-item' style={{borderColor: defineScheduleType(reco.schedulingType), width:"10%"}}>
               <p><strong style={{color: defineScheduleType(reco.schedulingType)}}>{reco.schedulingType}</strong></p>
            </div>
            </div>
          </div>
        ))
      }
      </div>
    );
  })()
 }
      </div>
  )
}

export default Recommendations