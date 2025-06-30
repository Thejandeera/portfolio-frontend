import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const emailRef = useRef(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ success: false, message: '' });
  const [fieldFocus, setFieldFocus] = useState(null);

  // Animation for input focus
  useEffect(() => {
    if (fieldFocus) {
      controls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 0.3 }
      });
    }
  }, [fieldFocus, controls]);

  // Auto-focus email field on mount
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Shake animation for errors
      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.6 }
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const loginData = {
        email: formData.email,
        password: formData.password
      };
      
      const response = await axios.post(`${backendUrl}api/users/login`, loginData);
      console.log(response);
      
      if (response.data.success) {
        setSubmitMessage({ 
          success: true, 
          message: 'Login successful! Redirecting...' 
        });
        
        // Save user data to session storage
        sessionStorage.setItem('userData', JSON.stringify(response.data.user));
        
        // Navigate to dashboard after delay
        setTimeout(() => {
          navigate('/'); // Change this to your desired redirect route
        }, 3500);
      } else {
        setSubmitMessage({ 
          success: false, 
          message: response.data.message || 'Login failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        }
      }
      
      setSubmitMessage({ success: false, message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 mt-15">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center">
                <motion.h2 
                  className="text-3xl font-bold text-gray-900"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Welcome Back
                </motion.h2>
                <motion.p 
                  className="text-gray-500 mt-2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Sign in to your account
                </motion.p>
              </div>
              
              {submitMessage.message ? (
                <motion.div 
                  className={`p-4 rounded-xl ${submitMessage.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} text-center`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className={`flex justify-center ${submitMessage.success ? 'text-green-500' : 'text-red-500'} mb-2`}>
                    {submitMessage.success ? (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <p className={`font-medium ${submitMessage.success ? 'text-green-800' : 'text-red-800'}`}>
                    {submitMessage.message}
                  </p>
                  {!submitMessage.success && (
                    <motion.button
                      onClick={() => {
                        setSubmitMessage({ success: false, message: '' });
                        setErrors({});
                      }}
                      className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try Again
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    animate={controls}
                    onFocus={() => setFieldFocus('email')}
                    onBlur={() => setFieldFocus(null)}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      ref={emailRef}
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-500 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  <motion.div
                    animate={controls}
                    onFocus={() => setFieldFocus('password')}
                    onBlur={() => setFieldFocus(null)}
                  >
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-500 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center"
                    >
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </motion.div>
                    
                    <motion.a
                      href="/forgot-password"
                      className="text-sm text-black hover:underline"
                      whileHover={{ scale: 1.02 }}
                    >
                      Forgot password?
                    </motion.a>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
            
            {/* Social login options */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </motion.a>
                
                <motion.a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Footer */}
        <motion.div 
          className="mt-6 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don't have an account?{' '}
          <motion.a 
            href="/signup" 
            className="text-black font-medium hover:underline"
            whileHover={{ scale: 1.02 }}
          >
            Sign up
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;