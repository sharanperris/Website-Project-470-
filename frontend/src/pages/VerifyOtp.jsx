import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const VerifyOTP = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { backendUrl } = useContext(ShopContext)
  
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds

  // Get email from location state or prompt user
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email)
    } else {
      const userEmail = prompt('Please enter your email address:')
      if (userEmail) {
        setEmail(userEmail)
      } else {
        navigate('/login')
      }
    }
  }, [location.state, navigate])

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setOtp(value)
    }
  }

  const verifyOTP = async (e) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/api/user/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Account verified successfully! You can now log in.')
        navigate('/login')
      } else {
        toast.error(data.message || 'Invalid OTP')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error('Error verifying OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Account</h2>
            <p className="text-slate-600 mb-6">
              Please enter the OTP for <span className="font-semibold text-orange-600">{email}</span>
            </p>
          </div>


          <form onSubmit={verifyOTP} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-2">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {/* Timer */}
            {timeLeft > 0 && (
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  OTP expires in <span className="font-semibold text-orange-600">{formatTime(timeLeft)}</span>
                </p>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-slate-600 hover:text-slate-800 text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default VerifyOTP