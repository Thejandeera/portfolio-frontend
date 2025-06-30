import React, { useState } from 'react';

const ProjectModal = ({ isOpen, onClose, onSubmit, userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    link: '',
    description: '',
    skills: '',
    images: Array(4).fill(null)
  });

  const [imagePreviews, setImagePreviews] = useState(Array(4).fill('/upload_area.png'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = reader.result;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);

    // Update form data
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData({ ...formData, images: newImages });

    const newPreviews = [...imagePreviews];
    newPreviews[index] = '/upload_area.png';
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Create FormData to send both files and JSON data
      const formDataToSend = new FormData();
      
      // Append project data as JSON
      formDataToSend.append('projectData', JSON.stringify({
        projectName: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        projectLink: formData.link,
        description: formData.description,
        skills: formData.skills,
        userId: userId
      }));
      
      // Append images if they exist
      formData.images.forEach((image, index) => {
        if (image) {
          formDataToSend.append(`image${index + 1}`, image);
        }
      });

      console.log("Form data prepared:", formDataToSend); // Debug log
      
      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors duration-200"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Add New Project</h3>
          
          {/* Project Images Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Project Images (Max 4)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div key={`image-${index}`} className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 text-center h-24 group transition-all duration-200 hover:border-gray-400">
                  <img 
                    src={imagePreviews[index]} 
                    alt={`Preview ${index + 1}`} 
                    className="h-full w-full object-cover rounded-md"
                  />
                  {formData.images[index] ? (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  ) : null}
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Project Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Project Name*</label>
            <input
              type="text"
              placeholder="My Awesome Project"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Start Date*</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Project Link */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Project Link</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50"
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description*</label>
            <textarea
              placeholder="Describe your project..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 h-24 resize-none bg-gray-50"
              rows={3}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Skills */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Skills Used*</label>
            <textarea
              placeholder="React, Node.js, MongoDB..."
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 h-24 resize-none bg-gray-50"
              rows={3}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50"
              disabled={!formData.name || !formData.startDate || !formData.description || !formData.skills || isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(ProjectModal);