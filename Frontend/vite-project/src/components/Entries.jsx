import React, { useEffect } from 'react'
import { useState } from 'react';
import apiClient from '../services/apiClient';
import './entries.css'
import Navbar from './Navbar';


const Entries = () => {
const [data,setData] = useState([]);
const [error,setError] = useState('');
const [selectedFilter, setSelectedFilter] = useState('all');
const [filteredData, setFilteredData] = useState([]);
const [analysis,setAnalysis] = useState([]);
const [showAnalysisModel, setShowAnalysisModel] = useState(false);
const [intensity, setIntensity] = useState({
  value:"",
  color:""
});

const filterByTimeRange = (filterType) => {
  const now = new Date();
  let startDate;
  switch(filterType) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '1m':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case '1y':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default:
      setFilteredData(data);
      return;
  }

   const filtered = data.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate >= startDate && entryDate <= now;
  })
  setFilteredData(filtered);
};

const filterOptions = [
  {value: 'all', label: 'Tümü'},
  {value: '24h', label:'Son 24 Saat'},
  {value: '7d', label: 'Son 1 Hafta'},
  {value: '1m', label: 'Son 1 Ay'},
  {value: '1y', label: 'Son 1 Yıl'}
];

const fetchData = async () => {
  try {
    const response = await apiClient.get("Entry");
    console.log("All Response: ",response);
    setData(response);

  }
  catch (error) {
    console.log("API Error: ",error);
    setError(error.message);
  }
}
useEffect(() => {
  filterByTimeRange(selectedFilter);
}, [selectedFilter, data]);

useEffect(() => {
fetchData();
},[]);

useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      setShowAnalysisModel(false);
    }
  };
  
  if (showAnalysisModel) {
    document.addEventListener('keydown', handleEsc);
  }
  
  return () => document.removeEventListener('keydown', handleEsc);
}, [showAnalysisModel]);

const getAnalysisByEntry =  async (entryId) => {
  try {
  const analysisResponse = await apiClient.get(`AIAnalysis/entry/${entryId}`);
  console.log("Analysis Response: ",analysisResponse);
  setAnalysis(analysisResponse);
  intensityLevel(analysisResponse.moodIntensity);
  }
  catch(error) {
    console.log("API veri çekme hatası!");
    setError(error.message);
  }
  finally{
    setShowAnalysisModel(true);
    
  }
  

}

const intensityLevel = (moodIntensity) => {
  if(moodIntensity < 5) {
    setIntensity({
      value:"Düşük",
      color:"#2BA600"
    });
  }
  else if(moodIntensity < 7) {
    setIntensity({
      value:"Normal",
      color:"#FFD754"
    });
  }
  else {
    setIntensity( {
      value:"Yüksek",
      color:"#FF0000"
    })
  }
}

  return (
     <div>
      <Navbar />
      <div style={{textAlign:"center"}}>
      <h1>Günlüklerin</h1>
      <div className='time-filter'>
        {filterOptions.map(option => (
          <button key={option.value} className={`filter-btn ${selectedFilter === option.value ? 'active' : ''}`} onClick={() => setSelectedFilter(option.value)}>{option.label}</button>
        ))}
      </div>
      </div>
      {filteredData.map((entry) => (
        <div key={entry.id} className="diary-book">
          <div className="diary-page">
            <div className="diary-entry">
              <div className="diary-date">
                {new Date(entry.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
                
              </div>
              <div className="diary-content">
                {entry.content}
              </div>
            </div>
            <div className="analysis-btn-container">
              <button className="analysis-btn" onClick={() => getAnalysisByEntry(entry.id)}>Yapay Zeka Analizi</button>
           </div>
          </div>
          
          
        </div>
      ))}
       {filteredData.length === 0 && (
        <div className="no-results">
          Bu tarih aralığında günlük bulunamadı.
        </div>
      )}
      {showAnalysisModel &&
      <div className='modal-overlay'>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          <button 
            className="close-btn" 
            onClick={() => setShowAnalysisModel(false)}
          >
            ✕
          </button>
          <div className='analysis-modal'>
          <h1>📊 Yapay Zeka Analizi</h1>
          <p style={{textAlign:"center", color: "#666"}}>
                  {new Date(analysis.analyzedAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
        </div>
          <div className="analysis-content">
                  <div className="analysis-section">
                    <h3>📝 Günlük Özetin</h3>
                    <p>{analysis.summary}</p>
                  </div>
                  
                  <div className="analysis-section">
                    <h3>😊 Ruh Hali</h3>
                    <p><strong>{analysis.mood}</strong></p>
                  </div>
                  
                  <div className="analysis-section">
                    <h3>🎯 Duygu Yoğunluğu</h3>
                    <p>{analysis.moodIntensity} / 10<span style={{color:intensity.color}}> {intensity.value}</span></p>
                  </div>
                  <div className='analysis-section'>
                    <h3>🧠 Tespit Edilen Duygular</h3>
                    {analysis.detectedEmotions.map((emotion,index) => (
                      <p>{emotion}</p>
                    ))}
                  </div>

          </div>

        </div>
        
      
      </div>
      }
    </div>
  )
}

export default Entries