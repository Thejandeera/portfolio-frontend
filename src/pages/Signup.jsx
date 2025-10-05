import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState('/man.jpg');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    role: '',
    image: null
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result.split(',')[1] // Store base64 without prefix
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1 && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (step === 2 && !formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    }
    
    if (step === 3) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }
    
    if (step === 4) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 5 && !formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (validateStep()) {
      await controls.start({
        x: 50,
        opacity: 0,
        transition: { duration: 0.2 }
      });
      setStep(prev => Math.min(prev + 1, 6));
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      });
    } else {
      // Shake animation for errors
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.6 }
      });
    }
  };

  const prevStep = async () => {
    await controls.start({
      x: -50,
      opacity: 0,
      transition: { duration: 0.2 }
    });
    setStep(prev => Math.max(prev - 1, 1));
    controls.start({
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    });
  };

  const resetForm = () => {
    setSubmitMessage({ success: false, message: '' });
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for the backend
      const userData = {
        fullName: formData.fullName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        institution: formData.institution,
        role: formData.role
      };
      
      // Create FormData for the multipart request
      const formDataToSend = new FormData();
      formDataToSend.append('userData', JSON.stringify(userData));
      
      if (formData.image) {
        // Convert base64 to Blob for proper file upload
        const byteString = atob(formData.image);
        const mimeString = 'image/jpeg';
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formDataToSend.append('image', blob, 'profile.jpg');
      }
      
      const response = await axios.post(`${backendUrl}/api/users`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSubmitMessage({ success: true, message: 'Registration successful! Redirecting...' });
      
      // Save user data to session storage
      sessionStorage.setItem('userData', JSON.stringify(response.data));
      
      // Navigate to login after delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      setSubmitMessage({ success: false, message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Personal Information",
      description: "Let's start with your full name",
      fields: (
        <div className="space-y-6">
          <motion.div
            animate={controls}
            onFocus={() => setFieldFocus('fullName')}
            onBlur={() => setFieldFocus(null)}
          >
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
              <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.fullName}
              </motion.p>
            )}
          </motion.div>
        </div>
      )
    },
    {
      title: "Username",
      description: "Choose a unique username",
      fields: (
        <div className="space-y-6">
          <motion.div
            animate={controls}
            onFocus={() => setFieldFocus('userName')}
            onBlur={() => setFieldFocus(null)}
          >
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
              Username
              <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.userName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300`}
              placeholder="johndoe123"
            />
            {errors.userName && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.userName}
              </motion.p>
            )}
          </motion.div>
        </div>
      )
    },
    {
      title: "Email",
      description: "Enter your email address",
      fields: (
        <div className="space-y-6">
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
        </div>
      )
    },
    {
      title: "Password",
      description: "Create a secure password",
      fields: (
        <div className="space-y-6">
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
          <motion.div
            animate={controls}
            onFocus={() => setFieldFocus('confirmPassword')}
            onBlur={() => setFieldFocus(null)}
          >
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
              <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.confirmPassword}
              </motion.p>
            )}
          </motion.div>
        </div>
      )
    },
    {
      title: "Institution & Role",
      description: "Tell us about your background",
      fields: (
        <div className="space-y-6">
          <motion.div
            animate={controls}
            onFocus={() => setFieldFocus('institution')}
            onBlur={() => setFieldFocus(null)}
          >
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
              Institution
              <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.institution ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300`}
              placeholder="University/Company Name"
            />
            {errors.institution && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.institution}
              </motion.p>
            )}
          </motion.div>
          <motion.div
            animate={controls}
            onFocus={() => setFieldFocus('role')}
            onBlur={() => setFieldFocus(null)}
          >
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
            >
              <option value="">Select your role</option>
              <option value="Student">Student</option>
              <option value="Professional">Professional</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Other">Other</option>
            </select>
          </motion.div>
        </div>
      )
    },
    {
      title: "Profile Picture",
      description: "Upload your profile picture",
      fields: (
        <div className="space-y-6 flex flex-col items-center">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
          <motion.p 
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Click the camera icon to upload a photo
          </motion.p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-8">
            <div className="p-1 bg-gradient-to-r from-gray-200 to-gray-300">
              <motion.div
                className="h-1.5 bg-gradient-to-r from-black to-gray-800 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <motion.h2 
                      className="text-2xl font-bold text-gray-900"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {steps[step - 1].title}
                    </motion.h2>
                    <motion.p 
                      className="text-gray-500"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {steps[step - 1].description}
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
                          onClick={resetForm}
                          className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Try Again
                        </motion.button>
                      )}
                    </motion.div>
                  ) : (
                    <>
                      {steps[step - 1].fields}
                      
                      <div className="flex justify-between pt-6">
                        <motion.button
                          type="button"
                          onClick={prevStep}
                          disabled={step === 1}
                          className={`px-4 py-2 rounded-lg flex items-center ${step === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:bg-gray-50'}`}
                          whileHover={step !== 1 ? { x: -3 } : {}}
                          whileTap={step !== 1 ? { scale: 0.95 } : {}}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          Back
                        </motion.button>
                        
                        {step < 6 ? (
                          <motion.button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </motion.button>
                        ) : (
                          <motion.button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : (
                              <>
                                Complete
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Step indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {steps.map((_, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => setStep(index + 1)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-2.5 h-2.5 rounded-full ${step === index + 1 ? 'bg-black' : 'bg-gray-300'}`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <motion.div 
          className="mt-6 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Already have an account?{' '}
          <motion.a 
            href="/login" 
            className="text-black font-medium hover:underline"
            whileHover={{ scale: 1.02 }}
          >
            Sign in
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;