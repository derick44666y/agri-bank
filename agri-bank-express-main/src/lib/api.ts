const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for auth
    };

    try {
      const response = await fetch(url, config);
      
      // Handle token refresh on 403
      if (response.status === 403) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request
          return fetch(url, config);
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Auth
  async register(email: string, password: string, fullName: string) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    return response.json();
  }

  async login(email: string, password: string) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async logout() {
    const response = await this.request('/api/auth/logout', {
      method: 'POST',
    });
    return response.json();
  }

  // Profile
  async getProfile() {
    const response = await this.request('/api/profile');
    return response.json();
  }

  async updateProfile(data: any) {
    const response = await this.request('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Accounts
  async getAccounts() {
    const response = await this.request('/api/accounts');
    return response.json();
  }

  async getAccount(id: string) {
    const response = await this.request(`/api/accounts/${id}`);
    return response.json();
  }

  async createAccount(data: any) {
    const response = await this.request('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateAccount(id: string, data: any) {
    const response = await this.request(`/api/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Transactions
  async getTransactions(accountId?: string, limit = 50) {
    const params = new URLSearchParams();
    if (accountId) params.append('accountId', accountId);
    params.append('limit', limit.toString());
    
    const response = await this.request(`/api/transactions?${params}`);
    return response.json();
  }

  async createTransfer(data: any) {
    const response = await this.request('/api/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Recipients
  async getRecipients() {
    const response = await this.request('/api/recipients');
    return response.json();
  }

  async createRecipient(data: any) {
    const response = await this.request('/api/recipients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateRecipient(id: string, data: any) {
    const response = await this.request(`/api/recipients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteRecipient(id: string) {
    const response = await this.request(`/api/recipients/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // KYC
  async getKycVerifications() {
    const response = await this.request('/api/kyc');
    return response.json();
  }

  async submitKyc(data: any) {
    const response = await this.request('/api/kyc', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Crypto
  async getCryptoHoldings() {
    const response = await this.request('/api/crypto');
    return response.json();
  }

  async updateCryptoHolding(data: any) {
    const response = await this.request('/api/crypto', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteCryptoHolding(id: string) {
    const response = await this.request(`/api/crypto/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}

export const api = new ApiClient();
