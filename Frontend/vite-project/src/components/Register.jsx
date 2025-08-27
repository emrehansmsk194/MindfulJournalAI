import React, { useState } from 'react'
import authService from '../services/authService';
import './login.css';
import {Link, useNavigate} from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData(prev => ({
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
    const response = await authService.register(formData.email, formData.password, formData.firstName, formData.lastName);
    console.log('Kayıt başarılı:', response);
    navigate(`/login?email=${encodeURIComponent(formData.email)}&registered=true`);
    
  }
  catch (error) {
    console.error("Kayıt hatası:",error);
    setError('Kayıt olma işlemi başarısız. Lütfen bilgilerinizi kontrol edin.');
  }
  finally {
    setLoading(false);
  }

}
const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
    }
}

  return (
    <div className='container'>
      <div className='login-container'>
      <h2 style={{textAlign:"center"}}>Kayıt Olun</h2>
            <div style={{marginTop: '1.5rem'}}>
                <label htmlFor="firstName" className="label-field">Adınız</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} onKeyDown={handleKeyDown} className="input-field" placeholder="Adınız" required />
            </div>
            <div style={{marginTop: '1.5rem'}}>
                <label htmlFor="lastName" className="label-field">Soyadınız</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} onKeyDown={handleKeyDown} className="input-field" placeholder="Soyadınız" required />
            </div>
            <div style={{marginTop: '1.5rem'}}>
                <label htmlFor="email" className="label-field">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} onKeyDown={handleKeyDown} className="input-field" placeholder="örnek@email.com" required />
            </div>
            <div style={{marginTop: '1.5rem'}}>
                <label htmlFor="password" className="label-field">Şifre</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} onKeyDown={handleKeyDown} className="input-field" placeholder="...." required />
            </div>
            { error && (
            <div style={{color:"red", padding:"1.5rem"}}>
            {error}
            </div>
            )}
             <button type="submit" disabled={loading} className="btn"  onClick={handleSubmit}>{loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}</button>
             <div style={{marginTop:'1.5rem'}}>
                  <Link to="/"> Hesabınız var mı? Giriş Yapın.</Link>
            </div>
          </div>
    </div>
  )
}

export default Register