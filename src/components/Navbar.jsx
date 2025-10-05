import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleConnectClick = () => {
        navigate("/signup");
    };

    const handleLogoutClick = () => {
        sessionStorage.removeItem('userData');
        setUserData(null);
        navigate("/");
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[9999] px-2 sm:px-4 md:px-6 py-2 sm:py-3 transition-all duration-300 h-[60px] sm:h-[72px] md:h-[80px] ${
            isScrolled
                ? 'bg-[#f2f2f2]/20 backdrop-blur shadow-lg'
                : 'bg-[#f2f2f2]/20 backdrop-blur shadow-lg'
        }`}>
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto h-full">
                {/* Left side - Logo and Brand */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <img
                        src="/blacklogo.png"
                        alt="Logo"
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] flex-shrink-0"
                    />
                    <a href="home" className="text-base sm:text-lg md:text-xl font-semibold text-black">
                        FolioCraft
                    </a>
                </div>

                {/* Mobile menu button */}
                <div className="sm:hidden flex items-center">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-black focus:outline-none p-2 rounded-md hover:bg-gray-200 transition"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                    </button>
                </div>

                {/* Center - Navigation Links (Desktop) */}
                <div className="hidden sm:flex items-center space-x-4 md:space-x-6 lg:space-x-8 text-base md:text-lg">
                    <a
                        href="home"
                        className="relative text-black transition-colors duration-200 hover:text-gray-500
             after:content-[''] after:absolute after:left-0 after:-bottom-1
             after:h-[2px] after:w-0 after:bg-gray-500
             after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Home
                    </a>
                    
                    <a
                        href="about"
                        className="relative text-black transition-colors duration-200 hover:text-gray-500
             after:content-[''] after:absolute after:left-0 after:-bottom-1
             after:h-[2px] after:w-0 after:bg-gray-500
             after:transition-all after:duration-300 hover:after:w-full"
                    >
                        About
                    </a>
                    <a
                        href="profile"
                        className="relative text-black transition-colors duration-200 hover:text-gray-500
             after:content-[''] after:absolute after:left-0 after:-bottom-1
             after:h-[2px] after:w-0 after:bg-gray-500
             after:transition-all after:duration-300 hover:after:w-full"
                    >
                        My Profile
                    </a>
                    <a
                        href="settings"
                        className="relative text-black transition-colors duration-200 hover:text-gray-500
             after:content-[''] after:absolute after:left-0 after:-bottom-1
             after:h-[2px] after:w-0 after:bg-gray-500
             after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Settings
                    </a>
                </div>

                {/* Right side - User Info or Connect Button */}
                <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
                    {userData ? (
                        <>
                            <div className="text-right">
                                <div className="text-sm text-black">Welcome</div>
                                <div className="text-sm font-medium text-black">
                                    {userData.fullName || userData.userName}
                                </div>
                            </div>
                            <img
                                src={userData.image}
                                alt="User"
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-600 object-cover flex-shrink-0"
                            />
                            <button
                                onClick={handleLogoutClick}
                                className="bg-red-400 text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-full font-medium text-xs sm:text-sm md:text-base transition-all duration-300 hover:bg-red-700 hover:scale-105 hover:shadow-lg cursor-pointer "
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleConnectClick}
                            className="bg-black text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-full font-medium text-xs sm:text-sm md:text-base transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg"
                        >
                            Connect with us
                        </button>
                    )}
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden absolute top-[60px] sm:top-[72px] left-0 right-0 bg-white shadow-lg rounded-b-lg py-3 px-4">
                        <div className="flex flex-col space-y-2">
                            <a
                                href="home"
                                className="text-black py-2 border-b border-gray-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </a>
                            <a
                                href="about"
                                className="text-black py-2 border-b border-gray-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </a>
                            <a
                                href="profile"
                                className="text-black py-2 border-b border-gray-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                My Profile
                            </a>
                            <a
                                href="settings"
                                className="text-black py-2 border-b border-gray-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Settings
                            </a>
                            {userData && (
                                <div className="flex items-center space-x-3 pt-2 pb-2 border-b border-gray-200">
                                    <img
                                        src={userData.image}
                                        alt="User"
                                        className="w-10 h-10 rounded-full border-2 border-gray-600 object-cover flex-shrink-0"
                                    />
                                    <div>
                                        <div className="text-sm text-black">Welcome</div>
                                        <div className="text-sm font-medium text-black">
                                            {userData.fullName || userData.userName}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {userData ? (
                                <button
                                    onClick={() => {
                                        handleLogoutClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full mt-3 bg-red-600 text-white px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleConnectClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full mt-3 bg-black text-white px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 hover:bg-gray-800"
                                >
                                    Connect with us
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;