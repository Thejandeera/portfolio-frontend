import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import Error404 from './Error404';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const PublicProfile = () => {
    const { userName } = useParams();
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        userName: '',
        email: '',
        role: '',
        institution: '',
        image: '/man.jpg'
    });

    const [projects, setProjects] = useState([]);
    const [education, setEducation] = useState([]);
    const [extraCurricular, setExtraCurricular] = useState([]);
    const [socialMedia, setSocialMedia] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [expandedSections, setExpandedSections] = useState({
        projects: true,
        education: true,
        extraCurricular: true,
        socialMedia: true
    });

    // For project details modal
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectModal, setShowProjectModal] = useState(false);

    // For image viewer
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backendUrl}/api/user-profile/full/by-username/${userName}`);

                if (response.data.success && response.data.data) {
                    const data = response.data.data;

                    setUserInfo({
                        fullName: data.user.fullName,
                        userName: data.user.userName,
                        email: data.user.email,
                        role: data.user.role,
                        institution: data.user.institution,
                        image: data.user.image || '/man.jpg'
                    });

                    setProjects(data.projects || []);
                    setEducation(data.educations || []);
                    setExtraCurricular(data.extraActivities || []);
                    setSocialMedia(data.socialMedia || {});
                } else {
                    setError('User profile not found');
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userName]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const openProjectDetails = (project) => {
        setSelectedProject(project);
        setShowProjectModal(true);
    };

    const openImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gray-50 pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return <Error404 />;
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 pt-16 sm:pt-20">
            <div className="max-w-full sm:max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 transition-all hover:shadow-md">
                    {/* Profile Image */}
                    <div className='flex justify-center mb-8'>
                        <div className='relative group'>
                            <img
                                src={userInfo.image}
                                alt='Profile'
                                className='w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer group-hover:opacity-90 transition-opacity'
                                onClick={() => openImage(userInfo.image)}
                            />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                                {userInfo.fullName}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Username</label>
                            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                                {userInfo.userName}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                                {userInfo.email}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Role</label>
                            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                                {userInfo.role}
                            </div>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-medium text-gray-500">Institution</label>
                            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                                {userInfo.institution}
                            </div>
                        </div>
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
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 cursor-pointer" onClick={() => openImage(project.image1 || '/project.jpeg')}>
                                            <img
                                                src={project.image1 || '/project.jpeg'}
                                                alt={project.projectName}
                                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                                {project.projectName}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                {new Date(project.startDate).toLocaleDateString()} -
                                                {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => openProjectDetails(project)}
                                                className="bg-gray-900 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-md hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm whitespace-nowrap"
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Education Section */}
                <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-6 mb-4 sm:mb-6 border border-gray-100 transition-all hover:shadow-md">
                    <div
                        className="flex items-center justify-between cursor-pointer p-2 sm:p-3 -m-2 sm:-m-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                        onClick={() => toggleSection('education')}
                    >
                        <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                        <svg
                            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedSections.education ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {expandedSections.education && (
                        <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-4 animate-fadeIn">
                            {education.map((edu) => (
                                <div key={edu.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200 group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{edu.institutionName}</h3>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-gray-500">{new Date(edu.endDate).getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Extra Curricular Section */}
                <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-6 mb-4 sm:mb-6 border border-gray-100 transition-all hover:shadow-md">
                    <div
                        className="flex items-center justify-between cursor-pointer p-2 sm:p-3 -m-2 sm:-m-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                        onClick={() => toggleSection('extraCurricular')}
                    >
                        <h2 className="text-xl font-semibold text-gray-900">Extra Curricular</h2>
                        <svg
                            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedSections.extraCurricular ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {expandedSections.extraCurricular && (
                        <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-4 animate-fadeIn">
                            {extraCurricular.map((extra) => (
                                <div key={extra.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200 group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{extra.name}</h3>
                                            <p className="text-sm text-gray-500">{extra.institutionName}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Social Media Section */}
                <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-6 mb-4 sm:mb-6 border border-gray-100 transition-all hover:shadow-md">
                    <div
                        className="flex items-center justify-between cursor-pointer p-2 sm:p-3 -m-2 sm:-m-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                        onClick={() => toggleSection('socialMedia')}
                    >
                        <h2 className="text-xl font-semibold text-gray-900">Social Media</h2>
                        <svg
                            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedSections.socialMedia ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {expandedSections.socialMedia && (
                        <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-4 animate-fadeIn">
                            {/* LinkedIn Link */}
                            {socialMedia.linkedInLink && (
                                <div className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200 group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full p-1.5">
                                            <img
                                                src="/linkedin.png"
                                                alt="LinkedIn"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <a
                                            href={socialMedia.linkedInLink.startsWith('http') ? socialMedia.linkedInLink : `https://${socialMedia.linkedInLink}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-900 hover:underline cursor-pointer truncate max-w-xs"
                                        >
                                            {socialMedia.linkedInLink}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* GitHub Link */}
                            {socialMedia.gitHubLink && (
                                <div className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200 group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full p-1.5">
                                            <img
                                                src="/github.png"
                                                alt="GitHub"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <a
                                            href={socialMedia.gitHubLink.startsWith('http') ? socialMedia.gitHubLink : `https://${socialMedia.gitHubLink}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-900 hover:underline cursor-pointer truncate max-w-xs"
                                        >
                                            {socialMedia.gitHubLink}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Website Link */}
                            {socialMedia.otherLink && (
                                <div className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200 group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full p-1.5">
                                            <img
                                                src="/link.png"
                                                alt="Website"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <a
                                            href={socialMedia.otherLink.startsWith('http') ? socialMedia.otherLink : `https://${socialMedia.otherLink}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-900 hover:underline cursor-pointer truncate max-w-xs"
                                        >
                                            {socialMedia.otherLink}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <Modal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)}>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{selectedProject.projectName}</h3>

                        {/* Project Images */}
                        <div className="grid grid-cols-2 gap-3">
                            {[selectedProject.image1, selectedProject.image2, selectedProject.image3, selectedProject.image4]
                                .filter(img => img)
                                .map((img, index) => (
                                    <div key={index} className="relative border border-gray-200 rounded-lg p-2 text-center h-32">
                                        <img
                                            src={img}
                                            alt={`Project ${index + 1}`}
                                            className="h-full w-full object-cover rounded-md cursor-pointer"
                                            onClick={() => openImage(img)}
                                        />
                                    </div>
                                ))
                            }
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Start Date</label>
                                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                                    {new Date(selectedProject.startDate).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">End Date</label>
                                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                                    {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : 'Present'}
                                </div>
                            </div>
                        </div>

                        {/* Project Link */}
                        {selectedProject.projectLink && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Project Link</label>
                                <a
                                    href={selectedProject.projectLink.startsWith('http') ? selectedProject.projectLink : `https://${selectedProject.projectLink}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 block text-blue-600 hover:underline"
                                >
                                    {selectedProject.projectLink}
                                </a>
                            </div>
                        )}

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-24 whitespace-pre-wrap">
                                {selectedProject.description}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Skills Used</label>
                            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-24 whitespace-pre-wrap">
                                {selectedProject.skills}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setShowProjectModal(false)}
                                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Image Viewer Modal */}
            <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)}>
                <div className="flex justify-center items-center h-full">
                    <img
                        src={selectedImage}
                        alt="Full size"
                        className="max-h-[80vh] max-w-full object-contain"
                    />
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setShowImageModal(false)}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>
            </Modal>

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
                
                button, input, select, textarea, a {
                    transition: all 0.2s ease;
                }
                
                ::-webkit-scrollbar {
                    width: 8px;
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

export default PublicProfile;