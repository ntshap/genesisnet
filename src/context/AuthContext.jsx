import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem('genesisnet-registered-users');
      return savedUsers ? JSON.parse(savedUsers) : [{ username: 'admin', email: 'admin@genesis.net', password: 'genesis123' }];
    } catch (error) {
      console.error('Error loading registered users:', error);
      return [{ username: 'admin', email: 'admin@genesis.net', password: 'genesis123' }];
    }
  });

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedInUser = () => {
      try {
        const savedUser = localStorage.getItem('genesisnet-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking authentication state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLoggedInUser();
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('genesisnet-user', JSON.stringify(userData));
  };

  // Register function
  const register = (userData) => {
    const newUser = {
      ...userData,
      userId: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('genesisnet-registered-users', JSON.stringify(updatedUsers));
    
    setUser(newUser);
    localStorage.setItem('genesisnet-user', JSON.stringify(newUser));
    
    return newUser;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('genesisnet-user');
  };

  // Context values to provide
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    registeredUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
