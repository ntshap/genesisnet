import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const token = localStorage.getItem('genesisnet-token');
        
        console.log('AuthContext: Checking if user is logged in. Token exists:', !!token);

        if (token) {
          // Verify token with backend
          try {
            const response = await apiService.Authentication.getCurrentUser();
            if (response.success) {
              console.log('AuthContext: Valid token, setting user as authenticated');
              setUser(response.data);
              setIsAuthenticated(true);
            } else {
              throw new Error('Invalid token');
            }
          } catch (apiError) {
            console.warn('AuthContext: Token validation failed:', apiError);
            throw apiError;
          }
        }
      } catch (error) {
        console.error('Error checking authentication state:', error);
        // Clear invalid tokens
        localStorage.removeItem('genesisnet-token');
        localStorage.removeItem('genesisnet-user');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Attempting to register with:', userData);
      
      const response = await apiService.Authentication.register({ email: userData.email, username: userData.firstName + ' ' + userData.lastName, password: userData.password });

      if (response.success) {
        console.log('Registration successful:', response.data);
        // Auto-login after successful registration
        const loginResult = await login(userData.email, userData.password);
        return loginResult;
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      return { success: false, error: error.message || 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Attempting to log in with:', { email });
      
      const response = await apiService.Authentication.login({
        username: email, // Backend expects username field but we use email
        password
      });

      if (response.success) {
        const { access_token, token_type } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('genesisnet-token', access_token);
        
        // Get user profile
        const userResponse = await apiService.Authentication.getCurrentUser();
        if (userResponse.success) {
          const userData = userResponse.data;
          localStorage.setItem('genesisnet-user', JSON.stringify(userData));
          
          setUser(userData);
          setIsAuthenticated(true);
          
          console.log('Login successful - Auth state updated:', {
            user: userData,
            isAuthenticated: true
          });
          
          return { success: true, user: userData };
        } else {
          throw new Error('Failed to get user profile');
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      return { success: false, error: error.message || 'Invalid email or password' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('genesisnet-token');
    localStorage.removeItem('genesisnet-user');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

