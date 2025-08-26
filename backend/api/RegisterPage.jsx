import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import genesisLogo from '../../assets/genesisnet-logo.png';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = ({ onBackToLogin, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [localError, setLocalError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { register, isLoading, error: authError } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const [isRegistering, setIsRegistering] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      console.log('Registration result:', result);
      
      if (result.success) {
        console.log('Registration successful, redirecting to dashboard');
        // Registration and auto-login successful
        onBackToLanding(); // Redirect to landing/dashboard
      } else {
        console.error('Registration failed:', result.error);
        setLocalError(result.error || 'Registration failed');
      }
    } catch (error) {
      setLocalError('An unexpected error occurred');
      console.error('Registration error:', error);
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

            {/* Back to Login button */}
            <button
              onClick={onBackToLogin}
              className="px-4 py-2 bg-purple-300 text-black border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm font-bold hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className={`w-full max-w-md transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Registration Form Card */}
          <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-black text-center">Create an Account</h2>
              <p className="text-sm text-gray-600 font-bold mt-2">
                Join the decentralized data marketplace
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
              {/* Name Fields - Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 ${
                      validationErrors.firstName ? 'border-red-500' : 'border-black'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold`}
                    placeholder="First name"
                  />
                  {validationErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600 font-bold">{validationErrors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 ${
                      validationErrors.lastName ? 'border-red-500' : 'border-black'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold`}
                    placeholder="Last name"
                  />
                  {validationErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600 font-bold">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 ${
                      validationErrors.email ? 'border-red-500' : 'border-black'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold`}
                    placeholder="Enter your email"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-xs text-red-600 font-bold">{validationErrors.email}</p>
                )}
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
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 ${
                      validationErrors.password ? 'border-red-500' : 'border-black'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold`}
                    placeholder="Create a password"
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
                {validationErrors.password && (
                  <p className="mt-1 text-xs text-red-600 font-bold">{validationErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-black'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 font-bold">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Register Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || isRegistering}
                  className="w-full flex items-center justify-center px-6 py-3 bg-yellow-300 border-2 border-black rounded-lg text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading || isRegistering ? 'Creating Account...' : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-black font-bold">
              Already have an account?{' '}
              <button onClick={onBackToLogin} className="text-purple-600 font-black hover:underline">
                Login
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

export default RegisterPage;
