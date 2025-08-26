import { websocketService } from './websocketService';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

// HTTP client with authentication
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    // Check if we should use a development fallback
    const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
    const useDevFallback = isDev && options.useDevFallback;
    
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('genesisnet-token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log(`API Request to ${url}:`, { config, data: options.body });
    
    // For development: return mock data if API is unavailable
    if (useDevFallback && endpoint.includes('/register')) {
      console.log('Using development fallback for registration');
      return { 
        id: 1, 
        username: 'devuser',
        email: JSON.parse(options.body).email,
        access_token: 'dev-token-123',
        token_type: 'bearer'
      };
    }
    
    try {
      // Attempt to fetch with timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...config,
        signal: abortController.signal
      }).finally(() => {
        clearTimeout(timeoutId);
      });
      
      console.log(`Response status:`, response.status);
      
      if (!response.ok) {
        let errorDetail;
        try {
          const errorResponse = await response.json();
          errorDetail = errorResponse.detail || response.statusText || 'Network error';
        } catch (jsonError) {
          // If we can't parse the error as JSON, use status text
          errorDetail = response.statusText || 'Network error';
        }
        
        console.error('API Error:', errorDetail);
        
        // Provide specific error message based on status code
        if (response.status === 404) {
          throw new Error(`Endpoint not found: ${endpoint}`);
        } else if (response.status === 401) {
          throw new Error('Authentication required');
        } else if (response.status === 403) {
          throw new Error('Access denied');
        } else if (response.status === 400) {
          throw new Error(errorDetail || 'Invalid request data');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(errorDetail || `HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json().catch(e => {
        console.warn('Error parsing JSON response:', e);
        return { success: false, error: 'Invalid response format' };
      });
      
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      // If the error is due to network connectivity, provide more specific message
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      } else if (error.message === 'Failed to fetch') {
        throw new Error('Network error. The server might be unavailable.');
      }
      
      // Add fallback for development mode on specific endpoints
      if (isDev) {
        // Fallback for '/users/users/me' endpoint
        if (endpoint === '/users/users/me' && error.message.includes('404')) {
          console.warn('Using development fallback for /users/users/me');
          return {
            id: 1,
            username: 'devuser',
            email: 'devuser@example.com',
            reputation_score: 5.0,
            wallet_address: null,
            created_at: new Date().toISOString()
          };
        }

        // Fallback for '/users/users/login' endpoint
        if (endpoint === '/users/users/login' && error.message.includes('404')) {
          console.warn('Using development fallback for /users/users/login');
          return {
            access_token: 'dev-token-' + Date.now(),
            token_type: 'bearer'
          };
        }
      }
      
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

const apiClient = new ApiClient();

// API Service
export const apiService = {
  // Authentication APIs
  auth: {
    // Use full path to endpoints to ensure correct URL
    login: (credentials) => {
      // Fix the double /api prefix issue by making sure we use the correct path
      return apiClient.post('/users/users/login', credentials)
        .catch(error => {
          // If we get a 404, try alternative endpoint
          if (error.message && error.message.includes('404')) {
            console.warn('Login endpoint not found, attempting alternative endpoint');
            return apiClient.post('/api/users/users/login', credentials);
          }
          throw error;
        });
    },
    register: (userData) => {
      console.log('Registering user with data:', userData);
      // Make sure required fields are present
      if (!userData.email || !userData.username || !userData.password) {
        console.error('Missing required registration fields');
        return Promise.reject(new Error('Missing required registration fields'));
      }
      
      return apiClient.post('/users/users/register', userData)
        .catch(error => {
          // If we get a 404, the endpoint might be different or the server is not running
          if (error.message && error.message.includes('404')) {
            console.warn('Registration endpoint not found, attempting fallback endpoint');
            // Try an alternative endpoint (many backends use /auth/register instead)
            return apiClient.post('/auth/register', userData);
          }
          throw error;
        });
    },
    logout: () => {
      localStorage.removeItem('genesisnet-token');
      return Promise.resolve();
    },
    verifyToken: () => apiClient.get('/users/users/me'),
    refreshToken: () => apiClient.post('/api/users/refresh-token'),
  },

  // Network APIs
  network: {
    getStatus: () => apiClient.get('/network/status'),
    getNodes: () => apiClient.get('/network/nodes'),
    getMetrics: () => apiClient.get('/network/metrics'),
    getConnections: () => apiClient.get('/network/connections'),
  },

  // Data Request APIs
    dataRequest: {
        search: (searchData) => {
            console.log('=== APISERVICE SEARCH DEBUG ===');
            console.log('apiService.dataRequest.search called with:', searchData);
            console.log('About to call apiClient.post with endpoint: /network/network/search-public');
            
            const result = apiClient.post('/network/network/search-public', searchData);
            console.log('apiClient.post returned:', result);
            console.log('Result is promise?', result instanceof Promise);
            
            if (result instanceof Promise) {
                return result.then(response => {
                    console.log('apiService.dataRequest.search resolved with:', response);
                    return response;
                }).catch(error => {
                    console.error('apiService.dataRequest.search rejected with:', error);
                    throw error;
                });
            }
            
            return result;
        },
        create: (requestData) => apiClient.post('/network/data-request', requestData),
        getStatus: (requestId) => apiClient.get(`/network/data-request/${requestId}/status`)
    },  // Wallet APIs
  wallet: {
    getBalance: () => apiClient.get('/wallet/balance'),
    getTransactions: () => apiClient.get('/wallet/transactions'),
    transfer: (transferData) => apiClient.post('/wallet/transfer', transferData),
    addFunds: (amount) => apiClient.post('/wallet/add-funds', { amount }),
  },

  // Real-time APIs (WebSocket)
  realtime: {
    connect: () => websocketService.connect(WS_URL),
    disconnect: () => websocketService.disconnect(),
    subscribeToMetrics: (callback) => websocketService.subscribe('metrics', callback),
    subscribeToNetwork: (callback) => websocketService.subscribe('network', callback),
    subscribeToWallet: (callback) => websocketService.subscribe('wallet', callback),
    subscribeToLogs: (callback) => websocketService.subscribe('logs', callback),
    getStatus: () => websocketService.getConnectionStatus(),
    sendMessage: (type, data) => websocketService.send(type, data),
  },
};

export default apiService;
