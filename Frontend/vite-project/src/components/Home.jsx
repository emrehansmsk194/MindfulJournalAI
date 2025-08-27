import React, { useEffect, useState } from 'react'
import authService from '../services/authService'
import apiClient from '../services/apiClient'
import './home.css'
import Logout from './Logout'
import {Link, useSearchParams,Navigate, useNavigate} from 'react-router-dom'

const Home = () => {
const [user,setUser] = useState([]);
const [data, setData] = useState([]);
const [analysis,setAnalysis] = useState([]);
const [journalText, setJournalText] = useState('');
const [textLength, setTextLength] = useState(0);
const [maxLength] = useState(2500);
const[error,setError] = useState('');
const [loading, setLoading] = useState(false);
const [showAnalysis, setShowAnalysis] = useState(false);
const [remain,setRemain] = useState(0);
const navigate = useNavigate();

const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setJournalText(text);
      setTextLength(text.length);
    }
    
    
  };

const createEntry = async () => {
  setLoading(true);
  try {
    const analysisEndTime = localStorage.getItem('analysisEndTime');
    const analysisData = localStorage.getItem('analysisData');
    
    if (analysisEndTime && Date.now() < analysisEndTime && analysisData) {
      setAnalysis(JSON.parse(analysisData));
      setShowAnalysis(true);
      setLoading(false);
      return; 
    }
    const response = await apiClient.post("Entry", {
  content: journalText,
});
    console.log('Full response:', response);
    const entryId = response.id;
    const analysisResponse = await apiClient.post(`AIAnalysis/analyze/${entryId}`);
    setData(response);
    setAnalysis(analysisResponse);
    console.log("analysis: ",analysisResponse);
    setShowAnalysis(true);
    const endTime = Date.now() + (10 * 60 * 60 * 1000);
    localStorage.setItem('analysisEndTime', endTime);
    localStorage.setItem('analysisData', JSON.stringify(analysisResponse));
  }
  catch(error){
    setError(error.message);
  }
  finally{
    setLoading(false);
  }
}





const CurrentUser = () => {
    const users = authService.getCurrentUser();
    setUser(users);
}


const formatRemainingTime = (milliseconds) => {
  if (milliseconds <= 0) return "00:00:00";
  
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
useEffect(() => {
    CurrentUser();
}, []);

useEffect(() => {
  const endTime = localStorage.getItem('analysisEndTime');
  const analysisData = localStorage.getItem('analysisData');
  
  if (endTime && Date.now() < endTime && analysisData) {
    setAnalysis(JSON.parse(analysisData));
    setShowAnalysis(true);
    
    const remaining = endTime - Date.now();
    setRemain(remaining);
    setTimeout(() => {
      setShowAnalysis(false);
      setAnalysis([]);
      localStorage.removeItem('analysisEndTime');
      localStorage.removeItem('analysisData');
    }, remaining);
  } else {
    localStorage.removeItem('analysisEndTime');
    localStorage.removeItem('analysisData');
  }
}, []);

useEffect(() => {
  if (remain <= 0) return;

  const timer = setInterval(() => {
    setRemain(prev => {
      if (prev <= 1000) { 
        clearInterval(timer);
        return 0;
      }
      return prev - 1000; 
    });
  }, 1000); 

  return () => clearInterval(timer); 
}, [remain]);
  return (
    
    <div>
        <header style={{textAlign:"center"}}>
            <h1>MindfulJournal AI</h1>
            <p>Yapay zeka destekli mental sağlık günlüğü</p>
        </header>
        <nav className="buttons-container">
            <button className='nav-btn' >Günlük Yaz</button>
            <button className='nav-btn' onClick={() => navigate('/entries')}>Günlüklerim</button>
            <button className='nav-btn' onClick={() => navigate('/trends')}>Trendler</button>
            <button className='nav-btn' onClick={() => navigate('/recommendations')}>Öneriler</button>
            <Logout />
        </nav>
        <div className='entry-text-container'>
            <h2>Merhaba {user.firstName}, Bugün nasıl hissediyorsun? </h2>
            <p>Düşüncelerini özgürce paylaş, AI asistanın seni anlayacak</p>
            <textarea  value={journalText}
            onChange={handleTextChange} maxLength={2500} className='text-area' placeholder='Bugün çok yorucu bir gün geçirdim. İş yerindeki projeyi bitirmeye çalışıyorum ama sürekli kesintiler oluyor. Biraz stresli hissediyorum ama yarın daha iyi olacağını umuyorum...' required>
            </textarea>
            <div style={{display:"flex",justifyContent:"flex-end", width:"100%", marginRight:"5rem"}}>
                <span>{textLength}/{maxLength}</span>
            </div>
            <div className='text-btn-container'>
            <button type='submit' className='text-btn' onClick={createEntry} disabled={showAnalysis}>Kaydet ve Analiz Et</button>
            </div>
            
          
            {showAnalysis && remain > 0 && (
              <div style={{textAlign: 'center', marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '1px solid #007bff'}}>
                <h4 style={{margin: '0 0 0.5rem 0', color: '#007bff'}}>⏰ Bir sonraki günlük için kalan süre:</h4>
                <p style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff', margin: 0}}>
                  {formatRemainingTime(remain)}
                </p>
                <small style={{color: '#666'}}>Analiz sonuçlarınız bu süre boyunca saklanacak</small>
              </div>
            )}
            
          {error && <div style={{padding:"1.5rem", color:"red"}}>
            {error}
            </div>}
        </div>
        {showAnalysis && <div className='analysis-container'>
                        <h1 style={{textAlign:"center"}}>📊Analiz Sonuçların</h1>
                        <p style={{textAlign:"center"}}>{new Date(analysis.analyzedAt).toLocaleDateString('tr-TR', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}</p>
                        <div className='outer-container'>
                        <div className='summary-container'>
                          <h1 style={{textAlign:"center"}}>📝Günlük Özetin</h1>
                          <p>{analysis.summary}</p>
                          <p>😊 Ruh Hali:{analysis.mood}</p>
                          
                        </div>
                        <div className='summary-container'>
                          <h3>🎯 Duygu Yoğunluğu: {analysis.moodIntensity} / 10</h3>
                          <h3>🧠 Tespit Edilen Duygular</h3>
                         
                            {analysis.detectedEmotions && analysis.detectedEmotions.map((emotion, index) => (
                              <div key={index}>
                                <ul>
                                  <li>
                                  <div>
                                    <p>{emotion}</p>
                                  </div>
                                  </li>
                                 
                                </ul>
                                
                              </div>
                            ))}
                         
                          
                        </div>
                        </div>
                        
                        
                        
                            

                        </div>}
    </div>
  )
}

export default Home