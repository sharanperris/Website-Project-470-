import User from '../models/userModel.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate and display OTP for user
export const generateOTPForUser = async (email) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Display OTP in console (mock email)
    console.log(`Mock OTP for ${email}: ${otp}`);

    return otp;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error;
  }
};

// Verify OTP API
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log(`🔍 OTP Verification Debug:`);
    console.log(`   Email: ${email}`);
    console.log(`   Submitted OTP: ${otp}`);
    console.log(`   Current time: ${new Date()}`);

    if (!email || !otp) {
      return res.json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // First, find the user to check their OTP details
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found for email: ${email}`);
      return res.json({
        success: false,
        message: 'User not found'
      });
    }

    console.log(`   Stored OTP: ${user.otp}`);
    console.log(`   OTP Expires: ${user.otpExpires}`);
    console.log(`   Is Expired: ${user.otpExpires < Date.now()}`);
    console.log(`   OTP Match: ${user.otp === otp}`);

    // Check if OTP matches and hasn't expired
    if (user.otp !== otp) {
      console.log(`❌ OTP mismatch`);
      return res.json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (user.otpExpires < Date.now()) {
      console.log(`❌ OTP expired`);
      return res.json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    console.log(`✅ User verified: ${user.name} (${user.email})`);

    res.json({
      success: true,
      message: 'Account verified successfully'
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.json({
      success: false,
      message: 'Error verifying OTP'
    });
  }
};

// Generate OTP for existing users (for profile verification)
export const generateOTPForProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.json({
        success: false,
        message: 'Account already verified'
      });
    }

    const otp = await generateOTPForUser(user.email);

    res.json({
      success: true,
      message: 'OTP generated. Check console for OTP.',
      otp: otp // Include for frontend display
    });
  } catch (error) {
    console.error('Error generating OTP for profile:', error);
    res.json({
      success: false,
      message: 'Error generating OTP'
    });
  }
};
