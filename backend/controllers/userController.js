import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { generateOTPForUser } from "./otpController.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check user already exist or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    // validate email and password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Password should be at least 8 characters long" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });

    const user = await newUser.save();

    // Generate OTP for new user
    const otp = await generateOTPForUser(email);

    res.json({ 
      success: true, 
      message: 'Registration successful! Please verify your account with the OTP.',
      requiresVerification: true
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Check if account is verified (handle existing users who might not have this field)
      const isVerified = user.isVerified !== undefined ? user.isVerified : false;
      
      if (!isVerified) {
        // For existing users without isVerified field, set it to false and generate OTP
        if (user.isVerified === undefined) {
          user.isVerified = false;
          await user.save();
        }
        
        // Generate new OTP for unverified user
        const otp = await generateOTPForUser(email);
        
        return res.json({ 
          success: false, 
          message: 'Account not verified. Please verify using OTP.',
          requiresVerification: true,
          email: email
        });
      }

      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // userId is now available from the middleware
    const userId = req.userId
    const user = await userModel.findById(userId).select('-password')

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    // userId is now available from the middleware
    const userId = req.userId
    const { name, email, phone, address, password } = req.body

    const updateData = { name, phone, address }

    // If email is being updated, validate it
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter a valid email" })
      }

      // Check if email already exists
      const existingUser = await userModel.findOne({ email, _id: { $ne: userId } })
      if (existingUser) {
        return res.json({ success: false, message: "Email already exists" })
      }

      updateData.email = email
    }

    // If password is being updated, hash it
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(password, salt)
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password')

    res.json({ success: true, user: updatedUser })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Fix existing users (admin route)
const fixExistingUsers = async (req, res) => {
  try {
    // Update all users who don't have isVerified field to be verified
    const updateResult = await userModel.updateMany(
      {
        $or: [
          { isVerified: { $exists: false } },
          { isVerified: null },
          { isVerified: undefined }
        ]
      },
      {
        $set: { 
          isVerified: true,  // Mark existing users as verified
          otp: null,
          otpExpires: null
        }
      }
    );

    console.log(`✅ Fixed ${updateResult.modifiedCount} existing users`);

    res.json({
      success: true,
      message: `Successfully updated ${updateResult.modifiedCount} existing users`,
      modifiedCount: updateResult.modifiedCount
    });
  } catch (error) {
    console.error('Error fixing existing users:', error);
    res.json({
      success: false,
      message: 'Error fixing existing users'
    });
  }
};

export { registerUser, loginUser, adminLogin, getUserProfile, updateUserProfile, fixExistingUsers }