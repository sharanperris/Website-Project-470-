import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import userAuth from '../middleware/userAuth.js';
import { createItem, getItems, claimItem, getItemById } from '../controllers/itemController.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Changed from 5MB to 10MB
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET all items (public route)
router.get('/', getItems);

// GET single item (public route)
router.get('/:id', getItemById);

// POST create new item (protected route)
router.post('/', userAuth, upload.array('images', 5), createItem);

// POST claim an item (protected route)
router.post('/:id/claim', userAuth, claimItem);

export default router;