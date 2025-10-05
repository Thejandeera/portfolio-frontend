import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBriefcase, FaUniversity, FaEye } from 'react-icons/fa';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Simple Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-100 rounded-3xl h-full" />
  </div>
);

const RandomUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        
        // Shuffle array and get first 4 users
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selectedUsers = shuffled.slice(0, 4).map(user => ({
          id: user.id,
          name: user.fullName,
          role: user.role,
          institution: user.institution,
          image: user.image || "/man.jpg" // Fallback image if not provided
        }));
        
        setUsers(selectedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Showing sample profiles.');
        // Fallback to sample data if API fails
        setUsers([
          {
            id: 1,
            name: "Alex Rivera",
            role: "Full-Stack Developer",
            institution: "Tech University",
            image: "/man.jpg"
          },
          {
            id: 2,
            name: "Jordan Lee",
            role: "UX/UI Designer",
            institution: "Design Academy",
            image: "/man.jpg"
          },
          {
            id: 3,
            name: "Taylor Kim",
            role: "Data Scientist",
            institution: "Analytics Institute",
            image: "/man.jpg"
          },
          {
            id: 4,
            name: "Casey Patel",
            role: "Product Manager",
            institution: "Business School",
            image: "/man.jpg"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            Featured Creators
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent"
        >
          Featured Creators
        </motion.h2>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-yellow-600 text-sm mb-6 italic"
          >
            {error}
          </motion.p>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {users.map((user) => (
            <motion.div 
              key={user.id} 
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.02, 
                transition: { duration: 0.3 } 
              }}
              className="group bg-white rounded-3xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* User Image Container */}
              <div className="relative z-10 flex justify-center mb-6">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="bg-white rounded-2xl p-3 border border-gray-200 shadow-md overflow-hidden"
                >
                  <img 
                    src={user.image} 
                    alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </div>
              
              {/* User Information */}
              <div className="relative z-10 text-center space-y-3">
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-bold text-gray-800 truncate"
                >
                  {user.name}
                </motion.h3>
                
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <FaBriefcase className="text-blue-500 text-sm" />
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 text-sm font-medium"
                  >
                    {user.role}
                  </motion.p>
                </div>
                
                <div className="flex items-center justify-center space-x-2">
                  <FaUniversity className="text-purple-500 text-sm" />
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500 text-xs italic"
                  >
                    {user.institution}
                  </motion.p>
                </div>
              </div>
              
              {/* View Profile Button */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 flex justify-center mt-6"
              >
                <button className="group/btn flex items-center space-x-2 bg-white text-gray-800 px-6 py-3 rounded-2xl text-sm font-semibold border border-gray-300 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  <span>View Profile</span>
                  <FaEye className="text-xs group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom styles for enhanced effects */}
        <style jsx>{`
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default RandomUsers;