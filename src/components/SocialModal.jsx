import React, { useState, useEffect } from 'react';

const SocialModal = ({ isOpen, onClose, onSubmit, initialData, linkType }) => {
  const [formData, setFormData] = useState({
    url: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        url: initialData[linkType] || ''
      });
    } else {
      setFormData({
        url: ''
      });
    }
  }, [initialData, linkType]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...initialData,
      [linkType]: formData.url
    };
    onSubmit(updatedData);
  };

  const getLinkInfo = () => {
    switch (linkType) {
      case 'linkedin':
        return {
          icon: '/linkedin.png',
          placeholder: 'https://linkedin.com/in/yourprofile',
          label: 'LinkedIn URL'
        };
      case 'github':
        return {
          icon: '/github.png',
          placeholder: 'https://github.com/yourusername',
          label: 'GitHub URL'
        };
      case 'website':
        return {
          icon: '/link.png',
          placeholder: 'https://yourwebsite.com',
          label: 'Website URL'
        };
      default:
        return {
          icon: '/link.png',
          placeholder: 'https://example.com',
          label: 'URL'
        };
    }
  };

  const { icon, placeholder, label } = getLinkInfo();

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-2 xs:p-3 sm:p-4 md:p-6">
      {/* Modal container - responsive width based on screen size */}
      <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 w-full max-w-[calc(100vw-2rem)] xs:max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto max-h-[90dvh] overflow-y-auto shadow-2xl animate-scaleIn">
        <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            {initialData && initialData[linkType] ? 'Update' : 'Add'} {label}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl md:text-3xl font-bold leading-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center bg-gray-100 rounded-full p-1 flex-shrink-0">
              <img
                src={icon}
                alt={label}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <input
              type="url"
              placeholder={placeholder}
              value={formData.url}
              onChange={(e) => setFormData({ url: e.target.value })}
              className="flex-1 px-3 sm:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-sm sm:text-base md:text-lg placeholder-gray-400 transition-all duration-200"
              required
              autoComplete="off"
              inputMode="url"
            />
          </div>

          <div className="flex justify-end gap-2 sm:gap-3 md:gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-xs xs:text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg font-medium hover:bg-gray-700 active:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-xs xs:text-sm sm:text-base"
            >
              {initialData && initialData[linkType] ? 'Update' : 'Add'} Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(SocialModal);