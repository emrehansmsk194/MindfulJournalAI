import { useState } from 'react'
import Login from './components/Login.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import './App.css'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import Register from './components/Register.jsx';
import Home from './components/Home.jsx';
import Entries from './components/Entries.jsx';
import Trends from './components/Trends.jsx';
import Recommendations from './components/Recommendations.jsx';

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute> <Home /></ProtectedRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
        <Route path='/entries' element={<ProtectedRoute> <Entries/></ProtectedRoute>}/>
        <Route path='/trends' element={<ProtectedRoute> <Trends/> </ProtectedRoute>}/>
        <Route path='/recommendations' element={<ProtectedRoute> <Recommendations /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
