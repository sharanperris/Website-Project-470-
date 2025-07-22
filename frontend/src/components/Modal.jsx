import React from 'react'

const Modal = ({ isOpen, onClose, title, message, buttonText = "OK" }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>{title}</h3>
          <p className='text-gray-600 mb-6'>{message}</p>
          <button 
            onClick={onClose}
            className='bg-green-500 text-white px-8 py-2 rounded-full font-medium hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;