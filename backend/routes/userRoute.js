import express from 'express'
import { registerUser, loginUser, getUserProfile, updateUserProfile, fixExistingUsers } from '../controllers/userController.js'
import { verifyOTP, generateOTPForProfile } from '../controllers/otpController.js'
import userAuth from '../middleware/userAuth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/profile', userAuth, getUserProfile)
userRouter.put('/profile', userAuth, updateUserProfile)

// OTP verification routes
userRouter.post('/verify-otp', verifyOTP)
userRouter.post('/generate-otp', userAuth, generateOTPForProfile)

// Admin route to fix existing users
userRouter.post('/fix-existing-users', fixExistingUsers)

export default userRouter