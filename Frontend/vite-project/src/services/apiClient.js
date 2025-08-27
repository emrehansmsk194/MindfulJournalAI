import authService from "./authService";
const API_BASE_URL = "https://localhost:7012/api";

class ApiClient {
    async get(endpoint) {
        const token = await authService.getToken();
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    }
    async post(endpoint, data) {
        const token = await authService.getToken();
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (response.status === 401) {
            authService.logout();
            window.location.href = '/login';
            return;
            }

        if (!response.ok) {
            throw new Error('İstek başarısız');
        }
        return response.json();
    }
    async put(endpoint, data) {
        const token = await authService.getToken();
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (response.status === 401) {
            authService.logout();
            window.location.href = '/login';
            return;
        }
        return response.json();
    }
    async delete(endpoint) {
    const token = await authService.getToken();

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      throw new Error('İstek başarısız');
    }

    return response.ok;
  }
}

export default new ApiClient();