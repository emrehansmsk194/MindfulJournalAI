import React, { useState } from 'react'
import authService from '../services/authService'
import './logout.css'
import './home.css'
const Logout = () => {

  const [isClicked, setIsClicked] = useState(false);


  return (
    <div>
      <div>
        <button className='nav-btn' onClick={() => setIsClicked(true)}>Çıkış Yap</button>
      </div>  
        {isClicked &&
        <div className='window-container'>
          <div className='window-content'>
            
            <h3>Çıkış yapmak istediğinize emin misiniz ?</h3>
            <div className='button-container'>
                <button className='logout-btn' onClick={() => authService.logout()}>Evet</button>
                <button className='logout-btn' onClick={() => setIsClicked(false)}>Hayır</button>
             </div>
        
          </div>
          
        </div>}
    </div>
  )
}
 

export default Logout