import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const slides = [
    {
      id: 1,
      image: "/image1.jpg",
      title: "Create Your Perfect Portfolio",
      subtitle: "Showcase Your Work Like Never Before",
      description: "Build stunning, professional portfolios that make you stand out from the crowd. No coding required."
    },
    {
      id: 2,
      image: "/image2.jpg",
      title: "Design That Speaks",
      subtitle: "Your Story, Beautifully Told",
      description: "Choose from our collection of modern templates and customize them to match your unique style and brand."
    },
    {
      id: 3,
      image: "/image3.jpg",
      title: "Launch Your Career",
      subtitle: "Get Noticed by Top Employers",
      description: "Share your portfolio with potential clients and employers. Track views, downloads, and engagement."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden" style={{
      paddingTop: '60px',
      minHeight: 'calc(100vh - 60px)'
    }}>
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-black rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 animate-fade-in-left">
              <div className="space-y-2 sm:space-y-4">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="block transform transition-all duration-700 hover:scale-105">
                    {slides[currentSlide].title}
                  </span>
                </h1>
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-600 font-medium">
                  {slides[currentSlide].subtitle}
                </h2>
                <p className="text-sm xs:text-base sm:text-lg text-gray-500 leading-relaxed max-w-xs xs:max-w-sm sm:max-w-md md:max-w-xl">
                  {slides[currentSlide].description}
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                <button onClick={() => navigate('/signup')} className="group bg-black text-white px-4 py-2 xs:px-6 xs:py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-sm xs:text-base sm:text-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-xl">
                  <span className="flex items-center justify-center gap-2">
                    Get Started Free
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <button onClick={() => navigate('/login')} className="border-2 border-gray-300 text-gray-700 px-4 py-2 xs:px-6 xs:py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-sm xs:text-base sm:text-lg transition-all duration-300 hover:border-black hover:text-black hover:scale-105 hover:shadow-lg">
                  Login With Your Account
                </button>
              </div>
              
              {/* Slide Indicators */}
              <div className="flex space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-black scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Content - Image Slider */}
            <div className="relative">
              <div className="relative w-full h-48 xs:h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 transform ${
                      index === currentSlide
                        ? 'translate-x-0 opacity-100 scale-100'
                        : index < currentSlide
                        ? '-translate-x-full opacity-0 scale-95'
                        : 'translate-x-full opacity-0 scale-95'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 1s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Hero;