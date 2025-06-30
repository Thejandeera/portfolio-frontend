import React, { useState, useEffect } from 'react';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ExtraModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    activity: '',
    school: '',
    customSchool: ''
  });
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Get user data from sessionStorage
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      if (userData && userData.id) {
        setUserId(userData.id);
        fetchInstitutions(userData.id);
      }
    }
  }, [isOpen]);

  const fetchInstitutions = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}api/education/user/${userId}/institutions`
      );
      
      // Parse the response data properly
      const institutionNames = response.data.map(item => {
        try {
          if (typeof item === 'string') {
            const parsed = JSON.parse(item);
            return parsed.institutionName;
          }
          return item.institutionName || item;
        } catch (e) {
          console.error('Error parsing institution:', item);
          return null;
        }
      }).filter(Boolean);
      
      setInstitutions(institutionNames);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const institutionName = formData.school === 'other' 
      ? formData.customSchool 
      : formData.school;
    
    onSubmit({
      activity: formData.activity,
      institutionName
    });
    
    onClose();
  };

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, school: value });
    setShowCustomInput(value === 'other');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-3 sm:p-6 max-w-xs sm:max-w-md w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
        <div className="flex justify-end mb-2 sm:mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors duration-200"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Add Extra Curricular</h3>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Activity Name</label>
            <input
              type="text"
              placeholder="Basketball Team"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-xs sm:text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Institution</label>
            {loading ? (
              <div className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs sm:text-sm">
                Loading institutions...
              </div>
            ) : (
              <>
                <select
                  value={formData.school}
                  onChange={handleSchoolChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-xs sm:text-sm"
                  required
                >
                  <option value="">Choose School / University</option>
                  {institutions.map((institution, index) => (
                    <option key={index} value={institution}>
                      {institution}
                    </option>
                  ))}
                  <option value="other">Other (please specify)</option>
                </select>
              </>
            )}
          </div>

          {showCustomInput && (
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Institution Name</label>
              <input
                type="text"
                placeholder="Enter institution name"
                value={formData.customSchool}
                onChange={(e) => setFormData({ ...formData, customSchool: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-xs sm:text-sm"
                required={showCustomInput}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 mt-2 sm:mt-4 text-xs sm:text-base"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Add Activity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(ExtraModal);