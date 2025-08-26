import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

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
        const savedUser = localStorage.getItem('genesisnet-user');
        
        console.log('AuthContext: Checking if user is logged in. Token exists:', !!token);

        if (token) {
          // Verify token with backend
          try {
            const response = await apiService.auth.verifyToken();
            if (response) {
              console.log('AuthContext: Valid token, setting user as authenticated');
              setUser(response);
              setIsAuthenticated(true);
            } else {
              // If backend validation fails but we have a saved user, use that
              if (savedUser) {
                try {
                  const userData = JSON.parse(savedUser);
                  console.log('AuthContext: Using saved user data as fallback');
                  setUser(userData);
                  setIsAuthenticated(true);
                } catch (parseError) {
                  console.warn('AuthContext: Failed to parse saved user data:', parseError);
                  throw new Error('Invalid saved user data');
                }
              } else {
                throw new Error('Invalid token and no saved user data');
              }
            }
          } catch (apiError) {
            console.warn('AuthContext: Token validation failed:', apiError);
            
            // If we're in development and have a saved user, use that
            if (import.meta.env.DEV && savedUser) {
              try {
                const userData = JSON.parse(savedUser);
                console.log('AuthContext: Using saved user data as development fallback');
                setUser(userData);
                setIsAuthenticated(true);
              } catch (parseError) {
                console.warn('AuthContext: Failed to parse saved user data:', parseError);
                throw apiError;
              }
            } else {
              throw apiError;
            }
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

      // Extract the needed data and format it correctly for the backend
      const email = userData.email;
      // Use email as username if no username provided
      const username = userData.username || userData.email;
      const password = userData.password;
      
      console.log('Attempting to register with:', { email, username });
      
      // Ensure we're sending the data format expected by the backend
      const registrationData = {
        email,
        username,
        password,
        full_name: userData.firstName && userData.lastName ? 
                  `${userData.firstName} ${userData.lastName}` : undefined
      };
      
      try {
        const response = await apiService.auth.register(registrationData);

        if (response) {
          console.log('Registration successful:', response);
          // Auto-login after successful registration
          const loginResult = await login(email, password);
          return loginResult;
        } else {
          throw new Error(response?.error || 'Registration failed');
        }
      } catch (apiError) {
        console.error('API registration error:', apiError);
        
        // If we can't register, but we have a development/test environment,
        // we can try to just log in directly (if the account might already exist)
        if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
          console.log('Development environment detected, attempting direct login');
          try {
            // Try to log in directly (in case the user already exists)
            const loginResult = await login(email, password);
            if (loginResult.success) {
              console.log('Direct login successful after registration failure');
              return loginResult;
            }
          } catch (loginError) {
            console.warn('Direct login also failed:', loginError);
          }
        }
        
        throw new Error(apiError.message || 'Registration service unavailable');
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
      
      try {
        const response = await apiService.auth.login({
          username: email, // Backend expects username field but we use email
          password
        });

        if (response) {
          const { access_token, token_type } = response;
          
          // Store token in localStorage
          localStorage.setItem('genesisnet-token', access_token);
          
          try {
            // Get user profile
            const userResponse = await apiService.auth.verifyToken();
            if (userResponse) {
              const userData = userResponse;
              localStorage.setItem('genesisnet-user', JSON.stringify(userData));
              
              setUser(userData);
              setIsAuthenticated(true);
              
              console.log('Login successful - Auth state updated:', {
                user: userData,
                isAuthenticated: true
              });
              
              return { success: true, user: userData };
            } else {
              // If we can't get user data but have a token, still log the user in
              // with limited information
              setIsAuthenticated(true);
              setUser({ username: email });
              return { success: true, user: { username: email } };
            }
          } catch (profileError) {
            console.warn('Error fetching user profile, using basic profile:', profileError);
            // Still consider this a successful login, just with limited user info
            setIsAuthenticated(true);
            setUser({ username: email });
            return { success: true, user: { username: email } };
          }
        } else {
          throw new Error('Invalid login response');
        }
      } catch (apiError) {
        console.error('API login error:', apiError);
        throw new Error('Login failed: ' + (apiError.message || 'Server error'));
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
