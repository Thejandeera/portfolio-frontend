import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import ProjectModal from '../components/ProjectModal';
import EducationModal from '../components/EducationModal';
import ExtraModal from '../components/ExtraModal';
import SocialModal from '../components/SocialModal';
import EditProjectModal from '../components/EditProjectModal';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
    // Move userData to useMemo to prevent re-reading on every render
    const userData = useMemo(() => {
        const data = sessionStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    }, []);

    const userId = userData?.id;

    const [userInfo, setUserInfo] = useState({
        fullName: userData?.fullName || '',
        userName: userData?.userName || '',
        email: userData?.email || '',
        role: userData?.role || 'Select Role',
        institution: userData?.institution || '',
        image: userData?.image || '/man.jpg'
    });

    const [editingProject, setEditingProject] = useState(null);
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [currentLinkType, setCurrentLinkType] = useState(null);

    const [projects, setProjects] = useState([]);
    const [education, setEducation] = useState([]);
    const [extraCurricular, setExtraCurricular] = useState([]);
    const [socialMedia, setSocialMedia] = useState([]);
    const [tempImage, setTempImage] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        projects: true,
        education: true,
        extraCurricular: true,
        socialMedia: true
    });

    // Modal states
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showExtraModal, setShowExtraModal] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);

    // Form states - Initialize with empty values consistently
    const [projectForm, setProjectForm] = useState({
        name: '',
        startDate: '',
        endDate: '',
        link: '',
        description: '',
        skills: '',
        images: []
    });

    const [educationForm, setEducationForm] = useState({
        schoolName: '',
        endDate: ''
    });

    const [extraForm, setExtraForm] = useState({
        activity: '',
        school: ''
    });

    const [socialForm, setSocialForm] = useState({
        linkedin: '',
        github: '',
        website: ''
    });

    // Memoize fetchAllUserData to prevent unnecessary re-creations
    const fetchAllUserData = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await axios.get(`${backendUrl}api/user-profile/${userId}`);
            const data = response.data.data;

            // Update user info
            setUserInfo(prev => ({
                ...prev,
                fullName: data.fullName || userData.fullName,
                userName: data.userName || userData.userName,
                email: data.email || userData.email,
                role: data.role || userData.role,
                institution: data.institution || userData.institution,
                image: data.profileImage || userData.image || '/man.jpg'
            }));

            // Set other data
            setProjects(data.projects || []);
            setEducation(data.educations || []);
            setExtraCurricular(data.extraActivities || []);

            // Handle social media (it's an object in the response)
            if (data.socialMedia) {
                setSocialMedia([{
                    id: data.socialMedia.id,
                    linkedin: data.socialMedia.linkedInLink,
                    github: data.socialMedia.gitHubLink,
                    website: data.socialMedia.otherLink
                }]);
            } else {
                setSocialMedia([]);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }, [userId, userData?.fullName, userData?.userName, userData?.email, userData?.role, userData?.institution, userData?.image]);

    // Fetch all user data on component mount
    useEffect(() => {
        fetchAllUserData();
    }, [fetchAllUserData]);

    const toggleSection = useCallback((section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }, []);

    const handleProjectUpdate = useCallback(async (projectId, formData) => {
        try {
            const response = await axios.put(
                `${backendUrl}api/projects/${projectId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setProjects(prev =>
                prev.map(project =>
                    project.id === projectId ? response.data : project
                )
            );
            setShowEditProjectModal(false);
            alert('Project updated successfully!');
        } catch (error) {
            console.error('Error updating project:', error);
            alert(`Failed to update project: ${error.response?.data?.message || error.message}`);
        }
    }, []);

    const handleUserInfoUpdate = useCallback(async () => {
        try {
            // Prepare updated user data
            const updatedUserData = {
                fullName: userInfo.fullName,
                userName: userInfo.userName,
                email: userInfo.email,
                role: userInfo.role,
                institution: userInfo.institution,
                image: userInfo.image
            };

            // Always call the update user API
            let updatedUser;

            if (tempImage) {
                // If there's a new image, use multipart/form-data endpoint
                const formData = new FormData();
                formData.append('userData', JSON.stringify(updatedUserData));
                formData.append('image', tempImage);

                const updateResponse = await axios.put(
                    `${backendUrl}api/users/${userId}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                updatedUser = updateResponse.data;
                setTempImage(null);
            } else {
                // If no new image, use JSON endpoint
                const updateResponse = await axios.put(
                    `${backendUrl}api/users/json/${userId}`,
                    updatedUserData
                );
                updatedUser = updateResponse.data;
            }

            // Update session storage with the response data from backend
            const newUserData = {
                ...userData,
                ...updatedUser
            };
            sessionStorage.setItem('userData', JSON.stringify(newUserData));

            // Update local state with the updated user data
            setUserInfo(prev => ({
                ...prev,
                ...updatedUser
            }));

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    }, [userInfo, tempImage, userId, userData]);

    const handleProjectSubmit = useCallback(async (formData) => {
        try {
            console.log("Submitting form data:", formData); // Debug log

            const response = await axios.post(`${backendUrl}api/projects`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProjects(prev => [...prev, response.data]);
            setShowProjectModal(false);
            alert('Project added successfully!');
        } catch (error) {
            console.error('Error adding project:', error);
            alert(`Failed to add project: ${error.response?.data?.message || error.message}`);
        }
    }, [userId]);

    const handleEducationSubmit = useCallback(async (formData) => {
        try {
            const response = await axios.post(`${backendUrl}api/education`, {
                institutionName: formData.schoolName,
                endDate: formData.endDate,
                userId: userId
            });
            setEducation(prev => [...prev, response.data]);
            setShowEducationModal(false);
            alert('Education added successfully!');
        } catch (error) {
            console.error('Error adding education:', error);
            alert('Failed to add education');
        }
    }, [userId]);
    
    const handleExtraSubmit = useCallback(async (formData) => {
        try {
            const response = await axios.post(`${backendUrl}api/extra-activities`, {
                name: formData.activity,
                institutionName: formData.institutionName,
                userId: userId
            });
            setExtraCurricular(prev => [...prev, response.data]);
            setShowExtraModal(false);
            alert('Extra curricular activity added successfully!');
        } catch (error) {
            console.error('Error adding extra curricular:', error);
            alert(error.response?.data?.message || 'Failed to add extra curricular activity');
        }
    }, [userId]);

    const handleSocialSubmit = useCallback(async (formData) => {
        try {
            let response;
            if (socialMedia.length > 0) {
                // Update existing social media
                response = await axios.put(
                    `${backendUrl}api/social-media/${socialMedia[0].id}`,
                    {
                        linkedInLink: formData.linkedin || '',
                        gitHubLink: formData.github || '',
                        otherLink: formData.website || '',
                        userId: userId
                    }
                );
            } else {
                // Create new social media
                response = await axios.post(`${backendUrl}api/social-media`, {
                    linkedInLink: formData.linkedin || '',
                    gitHubLink: formData.github || '',
                    otherLink: formData.website || '',
                    userId: userId
                });
            }
            setSocialMedia([response.data]);
            setShowSocialModal(false);
            fetchAllUserData(); // Refresh the data
        } catch (error) {
            console.error('Error updating social media:', error);
            alert('Failed to update social media');
        }
    }, [userId, socialMedia, fetchAllUserData]);

    const removeProject = useCallback(async (id) => {
        try {
            await axios.delete(`${backendUrl}api/projects/${id}`);
            setProjects(prev => prev.filter(project => project.id !== id));
            alert('Project deleted successfully!');
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    }, []);

    const removeEducation = useCallback(async (id) => {
        try {
            await axios.delete(`${backendUrl}api/education/${id}`);
            setEducation(prev => prev.filter(edu => edu.id !== id));
            alert('Education deleted successfully!');
        } catch (error) {
            console.error('Error deleting education:', error);
            alert('Failed to delete education');
        }
    }, []);

    const removeExtraCurricular = useCallback(async (id) => {
        try {
            await axios.delete(`${backendUrl}api/extra-activities/${id}`);
            setExtraCurricular(prev => prev.filter(extra => extra.id !== id));
            alert('Extra curricular activity deleted successfully!');
        } catch (error) {
            console.error('Error deleting extra curricular:', error);
            alert('Failed to delete extra curricular activity');
        }
    }, []);

    const removeSocialLink = useCallback(async (linkType) => {
        try {
            if (socialMedia.length === 0) return;

            const currentData = socialMedia[0];

            // Create payload with only the field we want to clear
            const payload = {
                userId: userId
            };

            // Only set the field we want to clear to empty string
            if (linkType === 'linkedin') {
                payload.linkedInLink = '';
            } else if (linkType === 'github') {
                payload.gitHubLink = '';
            } else if (linkType === 'website') {
                payload.otherLink = '';
            }

            const response = await axios.put(
                `${backendUrl}api/social-media/${currentData.id}`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSocialMedia([response.data]);
            fetchAllUserData();
        } catch (error) {
            console.error('Error removing social link:', error);
            alert(`Failed to remove social link: ${error.response?.data?.message || error.message}`);
        }
    }, [socialMedia, userId, fetchAllUserData]);

    // Memoize Modal Component to prevent re-creation
    const Modal = React.memo(({ isOpen, onClose, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
                    <div className="flex justify-end mb-2 sm:mb-4">
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors duration-200"
                        >
                            ×
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    });

    return (
        <div className="min-h-screen w-full bg-gray-50 pt-16 sm:pt-20">
            <div className="max-w-full sm:max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 transition-all hover:shadow-md">
                    {/* Profile Image */}
                    <div className='flex justify-center mb-4 sm:mb-6'>
                        <div className='relative group'>
                            <img
                                id='profile-image'
                                src={tempImage ? URL.createObjectURL(tempImage) : userInfo.image}
                                alt='Profile'
                                className='w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover group-hover:opacity-90 transition-opacity'
                            />
                            <button
                                onClick={() => document.getElementById('file-input').click()}
                                className='absolute bottom-0 right-0 bg-gray-900 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-700 transition-all duration-300 transform group-hover:scale-110 shadow-md'
                            >
                                <svg className='w-3 h-3 sm:w-4 sm:h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                                </svg>
                            </button>
                            <input
                                id='file-input'
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setTempImage(file);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* User Info Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-gray-500">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={userInfo.fullName}
                                onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 hover:border-gray-300 bg-gray-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-gray-500">Username</label>
                            <input
                                type="text"
                                placeholder="johndoe"
                                value={userInfo.userName}
                                onChange={(e) => setUserInfo({ ...userInfo, userName: e.target.value })}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 hover:border-gray-300 bg-gray-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-gray-500">Email</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                value={userInfo.email}
                                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 hover:border-gray-300 bg-gray-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-gray-500">Role</label>
                            <select
                                value={userInfo.role}
                                onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 hover:border-gray-300 bg-gray-50"
                            >
                                <option>Select Role</option>
                                <option>Student</option>
                                <option>Professional</option>
                                <option>Freelancer</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs sm:text-sm font-medium text-gray-500">Institution</label>
                            <input
                                type="text"
                                placeholder="University or Company"
                                value={userInfo.institution}
                                onChange={(e) => setUserInfo({ ...userInfo, institution: e.target.value })}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 hover:border-gray-300 bg-gray-50"
                            />
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-6">
                        <button
                            onClick={handleUserInfoUpdate}
                            className="w-full sm:w-auto bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 text-sm sm:text-base"
                        >
                            Save Profile
                        </button>
                    </div>
                </div>

                {/* Projects Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100 transition-all hover:shadow-md">
                    <div
                        className="flex items-center justify-between cursor-pointer p-2 -m-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
                        onClick={() => toggleSection('projects')}
                    >
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Projects</h2>
                        <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-300 ${expandedSections.projects ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {expandedSections.projects && (
                        <div className="mt-2 sm:mt-3 space-y-2 animate-fadeIn">
                            {projects.map((project) => (
                                <div key={project.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200 group">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={project.image1 || '/project.jpeg'}
                                                alt={project.projectName}
                                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{project.projectName}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">{project.startDate} - {project.endDate}</p>
                                        </div>
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingProject(project);
                                                    setShowEditProjectModal(true);
                                                }}
                                                className="text-gray-700 hover:text-gray-900 p-1 sm:px-2 sm:py-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => removeProject(project.id)}
                                                className="text-gray-500 hover:text-red-600 transition-colors duration-200 p-1"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setShowProjectModal(true)}
                                className="w-full py-2 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Project</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Education Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100 transition-all hover:shadow-md">
                    <div
                        className="flex items-center justify-between cursor-pointer p-2 -m-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
                        onClick={() => toggleSection('education')}
                    >
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Education</h2>
                        <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-300 ${expandedSections.education ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {expandedSections.education && (
                        <div className="mt-2 sm:mt-3 space-y-2 animate-fadeIn">
                            {education.map((edu) => (
                                <div key={edu.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200 group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{edu.institutionName}</h3>
                                        </div>
                                        <div className="flex items-center space-x-2 sm:space-x-4">
                                            <span className="text-xs sm:text-sm text-gray-500">{new Date(edu.endDate).getFullYear()}</span>
                                            <button
                                                onClick={() => removeEducation(edu.id)}
                                                className="text-gray-500 hover:text-red-600 transition-colors duration-200 p-1"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setShowEducationModal(true)}
                                className="w-full py-2 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Education</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Extra Curricular Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100 transition-all hover:shadow-md">
                    <div
                        className="flex items-center justify-between cursor-pointer p-2 -m-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
                        onClick={() => toggleSection('extraCurricular')}
                    >
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Extra Curricular</h2>
                        <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-300 ${expandedSections.extraCurricular ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {expandedSections.extraCurricular && (
                        <div className="mt-2 sm:mt-3 space-y-2 animate-fadeIn">
                            {extraCurricular.map((extra) => (
                                <div key={extra.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200 group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{extra.name}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">{extra.institution}</p>
                                        </div>
                                        <button
                                            onClick={() => removeExtraCurricular(extra.id)}
                                            className="text-gray-500 hover:text-red-600 transition-colors duration-200 p-1"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setShowExtraModal(true)}
                                className="w-full py-2 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Extra Curricular</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Social Media Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100 transition-all hover:shadow-md">
                    <div
                        className="flex items-center justify-between cursor-pointer p-2 -m-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
                        onClick={() => toggleSection('socialMedia')}
                    >
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Social Media</h2>
                        <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-300 ${expandedSections.socialMedia ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {expandedSections.socialMedia && (
                        <div className="mt-2 sm:mt-3 space-y-2 animate-fadeIn">
                            {/* LinkedIn Link */}
                            <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200 group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 rounded-full p-1">
                                            <img
                                                src="/linkedin.png"
                                                alt="LinkedIn"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        {socialMedia.length > 0 && socialMedia[0].linkedin ? (
                                            <div className="flex items-center space-x-2 sm:space-x-3">
                                                <a
                                                    href={socialMedia[0].linkedin.startsWith('http') ? socialMedia[0].linkedin : `https://${socialMedia[0].linkedin}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-900 hover:underline cursor-pointer truncate max-w-[120px] sm:max-w-xs text-xs sm:text-sm"
                                                >
                                                    {socialMedia[0].linkedin}
                                                </a>
                                                <button
                                                    onClick={() => removeSocialLink('linkedin')}
                                                    className="text-gray-500 hover:text-red-600 transition-colors duration-200 ml-1 p-1"
                                                    title="Remove LinkedIn link"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setCurrentLinkType('linkedin');
                                                    setShowSocialModal(true);
                                                }}
                                                className="text-gray-500 hover:text-gray-900 transition-colors duration-200 text-xs sm:text-sm"
                                            >
                                                Add LinkedIn URL
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setCurrentLinkType('linkedin');
                                            setShowSocialModal(true);
                                        }}
                                        className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1"
                                        title={socialMedia.length > 0 && socialMedia[0].linkedin ? "Edit LinkedIn link" : "Add LinkedIn link"}
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* GitHub Link */}
                            <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200 group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 rounded-full p-1">
                                            <img
                                                src="/github.png"
                                                alt="GitHub"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        {socialMedia.length > 0 && socialMedia[0].github ? (
                                            <div className="flex items-center space-x-2 sm:space-x-3">
                                                <a
                                                    href={socialMedia[0].github.startsWith('http') ? socialMedia[0].github : `https://${socialMedia[0].github}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-900 hover:underline cursor-pointer truncate max-w-[120px] sm:max-w-xs text-xs sm:text-sm"
                                                >
                                                    {socialMedia[0].github}
                                                </a>
                                                <button
                                                    onClick={() => removeSocialLink('github')}
                                                    className="text-gray-500 hover:text-red-600 transition-colors duration-200 ml-1 p-1"
                                                    title="Remove GitHub link"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setCurrentLinkType('github');
                                                    setShowSocialModal(true);
                                                }}
                                                className="text-gray-500 hover:text-gray-900 transition-colors duration-200 text-xs sm:text-sm"
                                            >
                                                Add GitHub URL
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setCurrentLinkType('github');
                                            setShowSocialModal(true);
                                        }}
                                        className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1"
                                        title={socialMedia.length > 0 && socialMedia[0].github ? "Edit GitHub link" : "Add GitHub link"}
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Website Link */}
                            <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200 group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 rounded-full p-1">
                                            <img
                                                src="/link.png"
                                                alt="Website"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        {socialMedia.length > 0 && socialMedia[0].website ? (
                                            <div className="flex items-center space-x-2 sm:space-x-3">
                                                <a
                                                    href={socialMedia[0].website.startsWith('http') ? socialMedia[0].website : `https://${socialMedia[0].website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-900 hover:underline cursor-pointer truncate max-w-[120px] sm:max-w-xs text-xs sm:text-sm"
                                                >
                                                    {socialMedia[0].website}
                                                </a>
                                                <button
                                                    onClick={() => removeSocialLink('website')}
                                                    className="text-gray-500 hover:text-red-600 transition-colors duration-200 ml-1 p-1"
                                                    title="Remove Website link"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setCurrentLinkType('website');
                                                    setShowSocialModal(true);
                                                }}
                                                className="text-gray-500 hover:text-gray-900 transition-colors duration-200 text-xs sm:text-sm"
                                            >
                                                Add Website URL
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setCurrentLinkType('website');
                                            setShowSocialModal(true);
                                        }}
                                        className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1"
                                        title={socialMedia.length > 0 && socialMedia[0].website ? "Edit Website link" : "Add Website link"}
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="text-center mb-6 sm:mb-8 animate-fadeIn flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                        onClick={() => window.location.href = `/${userInfo.userName}`}
                    >
                        View Public Profile
                    </button>
                    <button
                        className="bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm sm:text-base"
                        onClick={() => {
                            const profileUrl = `${window.location.origin}/${userInfo.userName}`;
                            navigator.clipboard.writeText(profileUrl)
                                .then(() => {
                                    alert('Profile URL copied to clipboard!');
                                })
                                .catch(err => {
                                    console.error('Failed to copy URL: ', err);
                                    alert('Failed to copy URL to clipboard');
                                });
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Copy Profile URL</span>
                    </button>
                </div>
            </div>

            {/* Modals */}
            <EditProjectModal
                isOpen={showEditProjectModal}
                onClose={() => setShowEditProjectModal(false)}
                onSubmit={handleProjectUpdate}
                project={editingProject}
                userId={userId}
            />

            <ProjectModal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                onSubmit={handleProjectSubmit}
                userId={userId}
            />

            <EducationModal
                isOpen={showEducationModal}
                onClose={() => setShowEducationModal(false)}
                onSubmit={handleEducationSubmit}
            />

            <ExtraModal
                isOpen={showExtraModal}
                onClose={() => setShowExtraModal(false)}
                onSubmit={handleExtraSubmit}
            />

            <SocialModal
                isOpen={showSocialModal}
                onClose={() => setShowSocialModal(false)}
                onSubmit={handleSocialSubmit}
                initialData={socialMedia.length > 0 ? socialMedia[0] : null}
                linkType={currentLinkType}
            />

            {/* Custom Animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out forwards;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.4s ease-out forwards;
                }
                
                /* Smooth transitions for all interactive elements */
                button, input, select, textarea, a {
                    transition: all 0.2s ease;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

export default Profile;