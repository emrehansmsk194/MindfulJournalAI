import React from 'react'
import './home.css'
import {Link, useSearchParams,Navigate, useNavigate} from 'react-router-dom'
import Logout from './Logout'
const Navbar = () => {
const navigate = useNavigate();
  return (
    <div>
        <header style={{textAlign:"center"}}>
            <h1>MindfulJournal AI</h1>
            <p>Yapay zeka destekli mental sağlık günlüğü</p>
        </header>
        <nav className="buttons-container">
            <button className='nav-btn' onClick={() => navigate('/')} >Günlük Yaz</button>
            <button className='nav-btn' onClick={() => navigate('/entries')}>Günlüklerim</button>
            <button className='nav-btn' onClick={() => navigate('/trends')}>Trendler</button>
            <button className='nav-btn' onClick={() => navigate('/recommendations')}>Öneriler</button>
            <Logout />
        </nav>
    </div>
  )
}

export default Navbar