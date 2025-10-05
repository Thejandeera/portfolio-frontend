import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaFolderOpen, FaGraduationCap, FaBriefcase, FaRocket } from 'react-icons/fa';

const About = () => {
    const features = [
        {
            icon: <FaUserPlus className="text-4xl text-blue-500" />,
            title: 'Create Your Account',
            description: 'Sign up in seconds and unlock a world of portfolio possibilities tailored just for you.'
        },
        {
            icon: <FaFolderOpen className="text-4xl text-green-500" />,
            title: 'Build Your Portfolio',
            description: 'Effortlessly add your skills, projects, and achievements with our intuitive drag-and-drop interface.'
        },
        {
            icon: <FaGraduationCap className="text-4xl text-purple-500" />,
            title: 'Publish Education',
            description: 'Showcase your academic journey, certifications, and learning milestones to impress potential employers.'
        },
        {
            icon: <FaBriefcase className="text-4xl text-orange-500" />,
            title: 'Highlight Experiences',
            description: 'Detail your professional background, internships, and career highlights in a stunning visual format.'
        },
        {
            icon: <FaRocket className="text-4xl text-red-500" />,
            title: 'Launch & Share',
            description: 'Publish your portfolio with one click and share it across networks to land your dream opportunities.'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    };

    const heroVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: 'easeOut' }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={heroVariants}
                        className="space-y-6"
                    >
                        <motion.h1 
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-800 via-black to-gray-900 bg-clip-text text-transparent"
                        >
                            About FolioCraft
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-xl sm:text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                        >
                            Empowering creators to craft stunning digital portfolios that tell their unique story and open doors to endless opportunities.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <a
                                href="/signup"
                                className="inline-block bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                Start Crafting Today
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
                        animate={{
                            x: [0, 200, 0],
                            y: [0, 100, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
                        animate={{
                            x: [0, -200, 0],
                            y: [0, -100, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </section>

            {/* About Description Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center space-y-8"
                    >
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                                Your Story, Amplified
                            </h2>
                        </motion.div>
                        <motion.p 
                            variants={itemVariants}
                            className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
                        >
                            At FolioCraft, we believe every professional has a unique narrative worth sharing. That's why we've built a seamless platform where you can create an account, input your data, and publish comprehensive portfolios featuring your education, experiences, skills, and projects. From fresh graduates to seasoned experts, FolioCraft turns your journey into a captivating showcase that resonates with recruiters and collaborators worldwide.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center space-y-12"
                    >
                        <motion.h2 
                            variants={itemVariants}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            Why Choose FolioCraft?
                        </motion.h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, y: -10 }}
                                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-800 to-black text-white">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold"
                    >
                        Ready to Craft Your Future?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-xl sm:text-2xl text-gray-300 leading-relaxed"
                    >
                        Join thousands of creators who have already transformed their careers with FolioCraft. Your portfolio awaits.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <a
                            href="/signup"
                            className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                        >
                            Get Started Now
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Custom CSS for blob animation */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};

export default About;