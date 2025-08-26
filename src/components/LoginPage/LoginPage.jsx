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
import { useAuth } from '../../context/AuthContext';

const LoginPage = ({ onBackToLanding, onCreateAccount }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { login, isLoading, error: authError } = useAuth();

  // Handler for "Create an account" link
  const handleCreateAccount = () => {
    if (typeof onCreateAccount === 'function') {
      onCreateAccount();
    }
  };

  useEffect(() => {
    // Animation effect when component mounts
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        // Login successful - redirect to dashboard
        console.log('Login successful, redirecting to dashboard');
        onBackToLanding(); // This triggers dashboard display in the App component
      } else {
        setLocalError(result.error || 'Login failed');
      }
    } catch (error) {
      setLocalError('An unexpected error occurred');
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-purple-50 to-blue-100 flex flex-col">
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
               Back to Landing
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className={`w-full max-w-md transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Login Form Card */}
          <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-black text-center">Login to GenesisNet</h2>
              <p className="text-sm text-gray-600 font-bold mt-2">
                Access the decentralized data marketplace
              </p>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 font-bold text-sm">{displayError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border-2 border-black rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-bold text-black">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-bold text-purple-600 hover:underline"
                >
                  Forgot password?
                </button>
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

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-black font-bold">
              Don't have an account?{' '}
              <button onClick={handleCreateAccount} className="text-purple-600 font-black hover:underline">
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
             2025 GenesisNet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
