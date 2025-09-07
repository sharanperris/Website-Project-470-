import userAuth from '../middleware/userAuth.js';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { createItem, getItems, claimItem, getItemById, requestItem, updateItemStatus, getUserRequests, updateRequestStatus, checkUserRequest } from '../controllers/itemController.js';
import fs from 'fs';

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

// POST request to claim an item (protected route)
router.post('/:id/request', userAuth, requestItem);

// POST claim an item (protected route)
router.post('/:id/claim', userAuth, claimItem);

// PATCH update item status (protected route)
router.patch('/:id/status', userAuth, updateItemStatus);

// GET user requests (protected route)
router.get('/requests', userAuth, getUserRequests);

// PUT update request status (protected route)
router.put('/requests/:requestId', userAuth, updateRequestStatus);

// GET check if user has requested an item (protected route)
router.get('/:id/check-request', userAuth, checkUserRequest);

export default router;