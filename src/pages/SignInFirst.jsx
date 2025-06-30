import React, { useEffect } from 'react';

const SignInFirst = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = document.querySelector('.sign-in-container');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / 20;
      const moveY = (y - centerY) / 20;
      
      document.querySelectorAll('.parallax-element').forEach((el, index) => {
        const factor = index * 0.2;
        el.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });
    };

    const container = document.querySelector('.sign-in-container');
    container?.addEventListener('mousemove', handleMouseMove);

    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="sign-in-container relative flex items-center justify-center min-h-screen w-full bg-white overflow-hidden px-2 sm:px-0">
      {/* Background elements with subtle parallax */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]"></div>
        </div>

        {/* Floating circles */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`circle-${i}`}
            className={`absolute rounded-full parallax-element ${i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'}`}
            style={{
              width: `${100 + (i * 50)}px`,
              height: `${100 + (i * 50)}px`,
              top: `${20 + (i * 10)}%`,
              left: `${10 + (i * 15)}%`,
              opacity: 0.3,
              filter: 'blur(20px)',
              animation: `float ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-md px-4 sm:px-6 py-8 sm:py-12 bg-white rounded-2xl shadow-2xl shadow-black/50 border border-black">
        <div className="flex flex-col items-center">
          {/* Animated lock icon */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center shadow-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-10 h-10 text-white animate-[bounce_2s_infinite]"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="absolute -inset-2 border-2 border-gray-200 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Text content */}
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            <span className="inline-block animate-[float_3s_ease-in-out_infinite]">S</span>
            <span className="inline-block animate-[float_3s_ease-in-out_infinite_0.3s]">i</span>
            <span className="inline-block animate-[float_3s_ease-in-out_infinite_0.6s]">g</span>
            <span className="inline-block animate-[float_3s_ease-in-out_infinite_0.9s]">n</span>
            <span className="inline-block mx-1"></span>
            <span className="inline-block animate-[float_3s_ease-in-out_infinite_1.2s]">I</span>
            <span className="inline-block animate-[float_3s_ease-in-out_infinite_1.5s]">n</span>
          </h1>
          
          <p className="text-gray-600 mb-6 sm:mb-8 text-center text-sm sm:text-base">Please authenticate to access this content</p>

          {/* Sign in button */}
          <a 
            href="/login" 
            className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-5 h-5"
            >
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
            </svg>
            Continue with your account
          </a>

          <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/register" className="text-black font-medium hover:underline">Sign up</a>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div 
        className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-md parallax-element"
        style={{
          animation: 'float 6s ease-in-out infinite'
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-8 h-8 text-gray-400"
        >
          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
        </svg>
      </div>

      <div 
        className="absolute top-20 left-20 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-md parallax-element"
        style={{
          animation: 'float 8s ease-in-out infinite 1s'
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-6 h-6 text-gray-400"
        >
          <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default SignInFirst;