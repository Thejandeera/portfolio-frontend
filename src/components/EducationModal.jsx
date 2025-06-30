import React, { useState } from 'react';

const EducationModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    schoolName: '',
    endDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

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
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Add Education</h3>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Institution Name</label>
            <input
              type="text"
              placeholder="University of Example"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Graduation Date</label>
            <input
              type="date"
              placeholder="End Date"
              value={formData.endDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-xs sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 mt-2 sm:mt-4 text-xs sm:text-base"
          >
            Add Education
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EducationModal);