
import express from 'express';
import { getOwnerRequests, getUserRequests, acceptRequest, rejectRequest } from '../controllers/requestController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Get requests for items owned by user
router.get('/owner', userAuth, getOwnerRequests);

// Get requests made by user
router.get('/user', userAuth, getUserRequests);

// Accept a request
router.patch('/:id/accept', userAuth, acceptRequest);

// Reject a request
router.patch('/:id/reject', userAuth, rejectRequest);

export default router;
