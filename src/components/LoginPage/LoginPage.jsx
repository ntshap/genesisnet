import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock,
  ArrowRight, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import genesisLogo from '../../assets/genesisnet-logo.png';

const LoginPage = ({ onLogin, onBackToLanding, onCreateAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials
  const validCredentials = {
    username: 'admin',
    password: 'genesis123'
  };

  useEffect(() => {
    // Animation effect when component mounts
    setIsVisible(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Check with the stored users in local storage
      const savedUsers = localStorage.getItem('genesisnet-registered-users');
      const registeredUsers = savedUsers ? JSON.parse(savedUsers) : [{ username: 'admin', password: 'genesis123' }];
      
      const foundUser = registeredUsers.find(user => 
        user.username === username && user.password === password
      );
      
      if (foundUser) {
        // Store user info in localStorage if rememberMe is checked
        if (rememberMe) {
          localStorage.setItem('genesisnet-user', JSON.stringify({ 
            username: foundUser.username,
            email: foundUser.email,
            userId: foundUser.userId
          }));
        }
        
        setIsLoading(false);
        onLogin({ 
          username: foundUser.username,
          email: foundUser.email,
          userId: foundUser.userId 
        });
      } else {
        setIsLoading(false);
        setError('Invalid username or password');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-400 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-1.5 relative">
                <div className="w-full h-full rounded-lg bg-white border-2 border-black flex items-center justify-center">
                  <img 
                    src={genesisLogo} 
                    alt="GenesisNet" 
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black text-black">
                  GenesisNet
                </h1>
                <p className="text-xs text-purple-600 font-bold">Data Marketplace</p>
              </div>
            </div>
            
            {/* Back to Landing button */}
            <button 
              onClick={onBackToLanding}
              className="px-4 py-2 bg-purple-300 text-black border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-bold hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div 
          className={`w-full max-w-md transition-all duration-500 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* Login Form Card */}
          <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            {/* Form Header */}
            <div className="bg-cyan-300 border-b-4 border-black p-6">
              <h2 className="text-2xl font-black text-black text-center">Login to GenesisNet</h2>
              <p className="text-center text-black mt-1 font-bold">Access your dashboard and marketplace</p>
            </div>
            
            {/* Form Body */}
            <div className="p-6">
              {error && (
                <div className="mb-6 p-3 bg-red-200 border-2 border-black rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                  <p className="text-sm font-bold text-red-800">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-black text-black mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User className="w-5 h-5 text-black" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full pl-10 pr-3 py-3 bg-yellow-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all font-bold"
                      required
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-black text-black mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-black" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-3 bg-yellow-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all font-bold"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? 
                        <EyeOff className="w-5 h-5 text-black" /> : 
                        <Eye className="w-5 h-5 text-black" />
                      }
                    </button>
                  </div>
                </div>
                
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="w-5 h-5 border-2 border-black rounded mr-2 accent-yellow-400"
                    />
                    <label htmlFor="remember-me" className="text-sm font-bold text-black">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm font-bold text-purple-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                
                {/* Login Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-6 py-3 bg-yellow-300 border-2 border-black rounded-lg text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? 'Logging in...' : (
                      <>
                        Login to Dashboard
                        <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-black font-bold">
              Don't have an account?{' '}
              <button onClick={() => onCreateAccount()} className="text-purple-600 font-black hover:underline">
                Create an account
              </button>
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t-4 border-black shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] px-4 py-3">
        <div className="text-center">
          <p className="text-xs font-bold text-gray-600">
            © 2025 GenesisNet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
