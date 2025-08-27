const API_BASE_URL = 'https://localhost:7012/api';

class AuthService {
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    password: password
                 })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Giriş başarısız');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                expiresAt: data.expiresAt
            }));
            return data;
        } catch (error) {
             console.error('Login error:', error);
             throw error;
        }
    }

     async register(email, password, firstName, lastName) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kayıt başarısız');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        expiresAt: data.expiresAt
      }));

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; 
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) return false;

    try {
      const userData = JSON.parse(user);
      const expiresAt = new Date(userData.expiresAt);
      const now = new Date();
      if(expiresAt < now) {
        this.logout();
        return false;
      }
      return true;
    } catch(error) {
      this.logout();
      return false;

    }
  }

    getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

}

export default new AuthService();