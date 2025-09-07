import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext.jsx'
import Modal from '../components/Modal'
import { useNavigate, useLocation } from 'react-router-dom'

const Login = () => {
  const location = useLocation();
  const [currentState, setCurrentState] = useState('Log In');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login: shopLogin, register } = useContext(ShopContext);
  const navigate = useNavigate();

  // Check URL parameters to determine initial state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');
    if (mode === 'signup') {
      setCurrentState('Sign Up');
    } else {
      setCurrentState('Log In');
    }
  }, [location]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Function to switch between Login and Sign Up
  const switchToSignUp = () => {
    setCurrentState('Sign Up');
    navigate('/login?mode=signup');
  };

  const switchToLogin = () => {
    setCurrentState('Log In');
    navigate('/login');
  };


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (currentState === 'Sign Up') {
        result = await register(formData.name, formData.email, formData.password);
        
        if (result.success) {
          if (result.requiresVerification) {
            // Redirect to OTP verification page
            navigate('/verify-otp', { 
              state: { email: formData.email } 
            });
          } else {
            // User is already logged in via ShopContext
            navigate('/');
          }
        } else {
          setError(result.message || 'Something went wrong');
        }
      } else {
        result = await shopLogin(formData.email, formData.password);
        
        if (result.success) {
          // User is already logged in via ShopContext
          navigate('/');
        } else {
          if (result.requiresVerification) {
            // Redirect to OTP verification page for unverified users
            navigate('/verify-otp', { 
              state: { email: formData.email } 
            });
          } else {
            setError(result.message || 'Something went wrong');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Make sure your backend server is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300`}>
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8'>
          <form onSubmit={onSubmitHandler} className='space-y-6'>
            {/* Header */}
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-slate-600 mb-2'>{currentState}</h2>
              <p className='text-slate-500 mb-4'>{currentState === 'Log In' ? 'Log in to your account' : 'Create a new account'}</p>
              <div className='w-12 h-1 bg-orange-400 mx-auto'></div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className='space-y-4'>
              {currentState === 'Sign Up' && (
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all' 
                  placeholder='Your Name' 
                  required
                />
              )}
              
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all' 
                placeholder='Email Address' 
                required
              />
              
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all' 
                placeholder='Password' 
                required
              />
            </div>

            {/* Links */}
            <div className='flex justify-between items-center text-sm'>
              <button type="button" onClick={switchToLogin} className='text-orange-500 hover:text-orange-700 transition-colors'>
                {currentState === 'Sign Up' ? '' : ''}
              </button>
              {currentState === 'Log In' ? (
                <button 
                  type="button"
                  onClick={switchToSignUp}
                  className='text-orange-600 hover:text-orange-700 transition-colors'
                >
                  Create Account
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={switchToLogin}
                  className='text-orange-600 hover:text-orange-700 transition-colors'
                >
                  Log In Here
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className='w-full bg-orange-400 text-white py-3 rounded-lg font-medium hover:bg-orange-500 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Processing...' : (currentState === 'Log In' ? 'Sign In' : 'Sign In')}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login