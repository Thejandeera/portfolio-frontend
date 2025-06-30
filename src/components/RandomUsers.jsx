import React, { useState, useEffect } from 'react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const RandomUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}api/users`);
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
        // Fallback to sample data if API fails
        setUsers([
          {
            id: 1,
            name: "User Name",
            role: "User Role",
            institution: "User Institution",
            image: "/man.jpg"
          },
          {
            id: 2,
            name: "User Name",
            role: "User Role",
            institution: "User Institution",
            image: "/man.jpg"
          },
          {
            id: 3,
            name: "User Name",
            role: "User Role",
            institution: "User Institution",
            image: "/man.jpg"
          },
          {
            id: 4,
            name: "User Name",
            role: "User Role",
            institution: "User Institution",
            image: "/man.jpg"
          }
        ]);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="backdrop-filter backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/40"
          >
            {/* User Image Container with Glass Effect */}
            <div className="flex justify-center mb-4">
              <div className="backdrop-filter backdrop-blur-md bg-white/40 rounded-2xl p-4 border border-white/30 shadow-sm">
                <img 
                  src={user.image} 
                  alt={user.name}
                  className="w-24 h-24 rounded-xl object-cover border border-white/30"
                />
              </div>
            </div>
            
            {/* User Information */}
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h3>
              <p className="text-gray-700 text-sm">
                {user.role}
              </p>
              <p className="text-gray-700 text-sm">
                {user.institution}
              </p>
            </div>
            
            {/* View Profile Button with Glass Effect */}
            <div className="flex justify-center">
              <button className="backdrop-filter backdrop-blur-sm bg-black/80 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black/70 transition-all duration-200 border border-white/20 shadow-md">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RandomUsers;