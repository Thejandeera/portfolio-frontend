import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
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
                {children}
            </div>
        </div>
    );
};

export default React.memo(Modal);