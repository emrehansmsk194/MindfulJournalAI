import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import authService from '../services/authService'
import apiClient from '../services/apiClient'
import './trends.css'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  BarChart,
  Bar,
  Pie,
  Cell
} from "recharts";


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];



const Trends = () => {
  const [user,setUser] = useState([]);
  const [error,setError] = useState('');
  const [data, setData] = useState({});
  
const CurrentUser = () => {
    const users = authService.getCurrentUser();
    setUser(users);
}

const fetchData = async () => {
    try {
        const response = await apiClient.get("Analytics/weekly-stats");
        setData(response.data || response);
    }
    catch(error) {
        console.log(error.message);
        setError(error);

    }
    

}


useEffect(() => {
    fetchData();
}, [])

useEffect(() => {
    CurrentUser();
}, []);


const moodData = data.moodDistribution 
  ? Object.entries(data.moodDistribution).map(([key, value]) => ({
      name: key,
      value
    }))
  : [];



const getEmotionColor = (emotion) => {
  const emotionCategories = {
    negative: ['endişe', 'acı', 'kaygı', 'sıkıntı', 'yalnızlık', 'çaresizlik', 'yetersizlik', 'umutsuzluk', 'karamsarlık', 'ümitsizlik'],
    positive: ['rahatlama', 'memnuniyet', 'umut', 'sevinç', 'heyecan'],
    neutral: ['halsizlik', 'monotonluk', 'özlem']
  };
  
  if (emotionCategories.negative.includes(emotion)) return '#e74c3c';
  if (emotionCategories.positive.includes(emotion)) return '#27ae60';
  return '#f39c12';
};

const topEmotions = data.emotionDistribution 
  ? Object.entries(data.emotionDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ 
        name, 
        value, 
        fill: getEmotionColor(name) 
      }))
  : [];

const total = moodData.length > 0 ? moodData.reduce((sum, d) => sum + d.value, 0) : 0;


  return (
    <div>
        <Navbar />
        <h1 style={{textAlign:"center"}}>{user.firstName}'ın Haftalık Trendleri</h1>
        <div className='analytics-container'>
            <div className='cards-container'>
            <div className='card'>
                <h3>Toplam Günlük Sayısı</h3>
                <p>{data.totalEntries}</p>
            </div>
            <div className='card'>
                <h3>📊Ortalama Duygu Yoğunluğu</h3>
                <p>{data.averageMoodIntensity} / 10</p>
            </div>
            <div className='card'>
                <h3>😊En Duygusal Gün</h3>
                <p style={{color:"green"}}>{data.bestMoodDay}</p>
            </div>
            <div className='card'>
                <h3>😞En Duygusuz Gün</h3>
                <p style={{color:"red"}}>{data.worstMoodDay}</p>
            </div>
           
        
           </div>
           <div className='charts-container'>
            <div  className='chart-container'>
                <h3 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>📈 Haftalık Duygu Yoğunluğu Trendi</h3>
                <div style={{ height: '350px' }}>
                     {data.dailyAverages && data.dailyAverages.length > 0 ? (
                       <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.dailyAverages} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date"/>
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="averageMood"
                                stroke="#feb47b"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                            />
                            </LineChart>
                       </ResponsiveContainer>
                       
                    ) : (
                        <p>Grafik yükleniyor...</p>
                    )}
                </div>
            </div>
            <div className='pieChart-container'>
                <h3 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>🎭 Ruh Hali Dağılımı</h3>
                <div style={{ height: '350px' }}>
                    {moodData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={moodData} cx="50%"  cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {moodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} gün`, 'Toplam']} />
                                <Legend />
                                <text x="50%" y= "50%" textAnchor='middle' dominantBaseline="middle" style={{fontWeight:"bold", fontSize:"1rem"}}>
                                    {total > 0 ? ((moodData[0].value / total) * 100).toFixed(0) : 0}%
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>Pie chart yükleniyor...</p>
                    )}
                </div>
            </div>
            <div  className='emotion-chart-container'>
                <h3 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>🏆 En Sık Yaşanan 5 Duygu</h3>
                <div style={{height:'350px'}}>
                    {topEmotions.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topEmotions} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 'dataMax + 1']} />
                        <Tooltip formatter={(value) => [`${value} kez`, 'Yaşanma Sıklığı']} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p>Duygu verileri yükleniyor...</p>
            )}
                </div>
            </div>
            
            </div>
            <div className='insights-section'>
                <div className='weekly-summary'>
                    <h3>📝 Haftalık Özet</h3>
                    <p>Bu hafta toplam {data.totalEntries} günlük yazıldı. Duygu yoğunluğunuz ortalama {data.averageMoodIntensity}/10 seviyesinde. En yoğun duygu yaşadığınız gün {data.bestMoodDay}, en sakin gününüz ise {data.worstMoodDay} oldu.</p>
                
                </div>
                <div className='insight-card'>
                    <div className='insight-card positive'>
                        <h4>🎯 Dikkat Çeken</h4>
                        <p>En sık yaşadığınız duygu: <strong>{topEmotions[0]?.name}</strong> ({topEmotions[0]?.value} kez)</p>
                    </div>
                </div>

            </div>

        </div>
    </div>
  )
}

export default Trends