import React, { useEffect } from "react";
import { useState } from 'react'
import authService from '../services/authService';
import './login.css';
import {Link, useSearchParams,Navigate, useNavigate} from 'react-router-dom'



const Login = () => {
const navigate = useNavigate();
const [searchParams] = useSearchParams();
const [SuccessMessage, setSuccessMessage] = useState('');
const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const emailFromUrl = searchParams.get('email');
  const isRegistered = searchParams.get("registered");
   if (emailFromUrl) {
      setFormData(prev => ({
        ...prev,
        email: emailFromUrl
      }));
    }
    
    if (isRegistered === 'true') {
      setSuccessMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } 
},[searchParams]);

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

     if (error) setError('');
}

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        const response = await authService.login(formData.email, formData.password);
        navigate('/', { replace: true });
    } catch (error) {
        console.error('Giriş hatası:', error);
        setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
        setLoading(false);
    }
}

const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
    }
}

  return (
    <div className = "container">
        
        <div className="login-container">
            <h2 style={{textAlign:"center"}}>Giriş Yapın</h2>
            <div className="form-group">
                <label htmlFor="email" className="label-field">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} onKeyDown={handleKeyDown} className="input-field" placeholder="örnek@email.com" required />
            </div>
            <div className="form-group">
                <label htmlFor="password" className="label-field">Şifre</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} onKeyDown={handleKeyDown} className="input-field" placeholder="...." required />
            </div>
              {error && (
          <div style={{color:"red", padding:"1.5rem"}}>
            {error}
          </div>
        )}
            <button type="submit" disabled={loading} className="btn"  onClick={handleSubmit}>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</button>
            <div className="form-group">
                  <Link to="/register" style={{color:"black"}}> Hesabınız yok mu? Kayıt olun.</Link>
            </div>
            
        </div>
      
       
    </div>
  )
}

export default Login