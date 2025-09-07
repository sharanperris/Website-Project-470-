import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRoute from './routes/userRoute.js'
import itemRoute from './routes/itemRoute.js'
import requestRoute from './routes/requestRoute.js'
import multer from 'multer'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()

// middlewares
app.use(express.json())
app.use(cors())

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'))

// api endpoints
app.use('/api/user', userRoute)
app.use('/api/items', itemRoute)
app.use('/api/requests', requestRoute)

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.json({
        success: false,
        message: 'File too large. Maximum size is 10MB.' 
      })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.json({
        success: false,
        message: 'Too many files. Maximum is 5 images.'
      })
    }
  }
  
  res.json({
    success: false,
    message: error.message || 'Something went wrong'
  })
})

app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))