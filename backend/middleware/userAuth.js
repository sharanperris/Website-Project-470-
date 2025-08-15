import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ success: false, message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Attach user ID to request object
    req.userId = decoded.id
    
    next()
  } catch (error) {
    console.log('Auth middleware error:', error)
    if (error.name === 'JsonWebTokenError') {
      return res.json({ success: false, message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: 'Token expired' })
    }
    res.json({ success: false, message: 'Authentication failed' })
  }
}

export default userAuth