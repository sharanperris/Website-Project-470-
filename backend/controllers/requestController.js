
import mongoose from 'mongoose';
import Request from '../models/requestModel.js';
import Item from '../models/itemModel.js';

// Get all requests for items owned by the user
export const getOwnerRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Request.find({ owner: userId })
      .populate('item', 'title images status')
      .populate('requester', 'name email')
      .sort({ createdAt: -1 });

    // Convert relative image paths to absolute URLs
    const requestsWithAbsoluteUrls = requests.map(request => ({
      ...request.toObject(),
      item: {
        ...request.item.toObject(),
        images: request.item.images.map(imagePath => 
          imagePath.startsWith('http') 
            ? imagePath 
            : `${req.protocol}://${req.get('host')}${imagePath}`
        )
      }
    }));

    res.json({
      success: true,
      requests: requestsWithAbsoluteUrls
    });
  } catch (error) {
    console.error('Error fetching owner requests:', error);
    res.json({
      success: false,
      message: 'Error fetching requests'
    });
  }
};

// Get all requests made by the user
export const getUserRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Request.find({ requester: userId })
      .populate('item', 'title images status')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    // Convert relative image paths to absolute URLs
    const requestsWithAbsoluteUrls = requests.map(request => ({
      ...request.toObject(),
      item: {
        ...request.item.toObject(),
        images: request.item.images.map(imagePath => 
          imagePath.startsWith('http') 
            ? imagePath 
            : `${req.protocol}://${req.get('host')}${imagePath}`
        )
      }
    }));

    res.json({
      success: true,
      requests: requestsWithAbsoluteUrls
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.json({
      success: false,
      message: 'Error fetching requests'
    });
  }
};

// Accept a request
export const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.userId;

    // Validate request ID
    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return res.json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    const request = await Request.findById(requestId).populate('item');
    
    if (!request) {
      return res.json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if the user is the owner of the item
    if (request.owner.toString() !== userId) {
      return res.json({
        success: false,
        message: 'You are not authorized to accept this request'
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Check if item still exists and is available
    if (!request.item) {
      return res.json({
        success: false,
        message: 'Item no longer exists'
      });
    }

    if (request.item.status !== 'Available') {
      return res.json({
        success: false,
        message: 'Item is no longer available'
      });
    }

    // Update request status to accepted
    request.status = 'accepted';
    await request.save();

    // Update item status to claimed
    const item = await Item.findById(request.item._id);
    item.status = 'Claimed';
    item.claimedBy = request.requester;
    item.claimedAt = new Date();
    await item.save();

    // Reject all other pending requests for this item
    await Request.updateMany(
      { 
        item: request.item._id, 
        _id: { $ne: requestId },
        status: 'pending'
      },
      { status: 'rejected' }
    );

    res.json({
      success: true,
      message: 'Request accepted successfully'
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.json({
      success: false,
      message: 'Error accepting request'
    });
  }
};

// Reject a request
export const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.userId;

    // Validate request ID
    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return res.json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if the user is the owner of the item
    if (request.owner.toString() !== userId) {
      return res.json({
        success: false,
        message: 'You are not authorized to reject this request'
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update request status to rejected
    request.status = 'rejected';
    await request.save();

    res.json({
      success: true,
      message: 'Request rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.json({
      success: false,
      message: 'Error rejecting request'
    });
  }
};
