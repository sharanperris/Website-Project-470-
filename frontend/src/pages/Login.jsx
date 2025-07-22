import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showModal = (title, message) => {
    setModal({
      isOpen: true,
      title,
      message
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      title: '',
      message: ''
    });
    // Navigate to home page after closing the success modal
    if (modal.title === 'Success') {
      navigate('/');
    }
  };

  const onSubmitHandler = async(event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url = currentState === 'Sign Up' 
        ? 'http://localhost:4000/api/user/register' 
        : 'http://localhost:4000/api/user/login';

      const payload = currentState === 'Sign Up' 
        ? formData 
        : { email: formData.email, password: formData.password };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        if (currentState === 'Sign Up') {
          showModal('Success', 'Successfully Registered!');
        } else {
          showModal('Success', 'Login Successful!');
        }
      } else {
        showModal('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      showModal('Error', `Network error: ${error.message}. Make sure your backend server is running on port 4000.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 transition-all duration-300 ${modal.isOpen ? 'blur-sm' : ''}`}>
        <div className='bg-white rounded-lg shadow-lg p-8 w-full max-w-md'>
          <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
            <div className='text-center mb-6'>
              <h2 className='text-3xl font-bold text-gray-800 mb-2'>{currentState}</h2>
              <div className='w-16 h-1 bg-green-500 mx-auto rounded'></div>
            </div>
            
            {currentState === 'Login' ? '' : 
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all' 
                placeholder='Your Name' 
                required
              />
            }
            
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all' 
              placeholder='Email' 
              required
            />
            
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all' 
              placeholder='Password' 
              required
            />
            
            <div className='flex justify-between text-sm mt-2 mb-4'>
              <p className='text-teal-600 cursor-pointer hover:text-teal-700 transition-colors'>
                Forgot your password?
              </p>
              {
                currentState === 'Login'
                ? <p onClick={()=>setCurrentState('Sign Up')} className='text-teal-600 cursor-pointer hover:text-teal-700 transition-colors'>
                    Create Account
                  </p>
                : <p onClick={()=>setCurrentState('Login')} className='text-teal-600 cursor-pointer hover:text-teal-700 transition-colors'>
                    Login Here
                  </p>
              }
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className='bg-green-500 text-white font-medium px-8 py-3 rounded-lg hover:bg-green-600 hover:shadow-lg transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Processing...' : (currentState === 'Login' ? 'Sign In' : 'Sign Up')}
            </button>
          </form>
        </div>
      </div>

      {/* Custom Modal */}
      <Modal 
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
      />
    </>
  )
}

export default Login