
import Item from '../models/itemModel.js';
import Request from '../models/requestModel.js';

// Create new item
export const createItem = async (req, res) => {
  try {
    const { title, description, category, condition, location } = req.body;
    const postedBy = req.userId; // This comes from userAuth middleware

    // Validate required fields
    if (!title || !description || !category || !condition || !location) {
      return res.json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Handle image uploads
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      // Store relative paths for uploaded images
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Create new item
    const newItem = new Item({
      title,
      description,
      category,
      condition,
      location,
      images: imagePaths,
      postedBy
    });

    await newItem.save();

    res.json({
      success: true,
      message: 'Item posted successfully',
      item: newItem
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.json({
      success: false,
      message: 'Error posting item'
    });
  }
};

// Get all available items
export const getItems = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = { status: { $in: ['Available', 'Claimed'] } };

    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query)
      .populate('postedBy', 'name email')
      .populate('requests.user', 'name email')
      .sort({ createdAt: -1 });

    // Convert relative image paths to absolute URLs
    const itemsWithAbsoluteUrls = items.map(item => ({
      ...item.toObject(),
      images: item.images.map(imagePath => 
        imagePath.startsWith('http') 
          ? imagePath 
          : `${req.protocol}://${req.get('host')}${imagePath}`
      )
    }));

    res.json({
      success: true,
      items: itemsWithAbsoluteUrls
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.json({
      success: false,
      message: 'Error fetching items'
    });
  }
};

// Add item request function (updated to use Request model)
export const requestItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.userId;
    const { message = '' } = req.body;

    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status !== 'Available') {
      return res.json({
        success: false,
        message: 'Item is no longer available'
      });
    }

    if (item.postedBy.toString() === userId) {
      return res.json({
        success: false,
        message: 'You cannot request your own item'
      });
    }

    // Check if user has already requested this item
    const existingRequest = await Request.findOne({
      item: itemId,
      requester: userId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.json({
        success: false,
        message: 'You have already requested this item'
      });
    }

    // Create new request
    const newRequest = new Request({
      item: itemId,
      requester: userId,
      owner: item.postedBy,
      message
    });
    
    await newRequest.save();

    res.json({
      success: true,
      message: 'Request sent successfully'
    });
  } catch (error) {
    console.error('Error requesting item:', error);
    res.json({
      success: false,
      message: 'Error requesting item'
    });
  }
};

// Claim an item
export const claimItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.userId;

    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status !== 'Available') {
      return res.json({
        success: false,
        message: 'Item is no longer available'
      });
    }

    if (item.postedBy.toString() === userId) {
      return res.json({
        success: false,
        message: 'You cannot claim your own item'
      });
    }

    // Update item status
    item.status = 'Claimed';
    item.claimedBy = userId;
    item.claimedAt = new Date();
    
    await item.save();

    res.json({
      success: true,
      message: 'Item claimed successfully'
    });
  } catch (error) {
    console.error('Error claiming item:', error);
    res.json({
      success: false,
      message: 'Error claiming item'
    });
  }
};

// Update item status
export const updateItemStatus = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.userId;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Available', 'Claimed', 'No longer available'];
    if (!validStatuses.includes(status)) {
      return res.json({
        success: false,
        message: 'Invalid status'
      });
    }

    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is the owner
    if (item.postedBy.toString() !== userId) {
      return res.json({
        success: false,
        message: 'You are not authorized to update this item'
      });
    }

    // Update item status
    item.status = status;
    await item.save();

    // If marking as "No longer available", reject all pending requests
    if (status === 'No longer available') {
      await Request.updateMany(
        { item: itemId, status: 'pending' },
        { status: 'rejected' }
      );
    }

    res.json({
      success: true,
      message: 'Item status updated successfully'
    });
  } catch (error) {
    console.error('Error updating item status:', error);
    res.json({
      success: false,
      message: 'Error updating item status'
    });
  }
};

// Get item by ID (updated to include request info)
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('claimedBy', 'name email');
    
    if (!item) {
      return res.json({
        success: false,
        message: 'Item not found'
      });
    }

    // Get user's request for this item if authenticated
    let userRequest = null;
    if (req.userId) {
      userRequest = await Request.findOne({
        item: req.params.id,
        requester: req.userId
      });
    }

    // Convert relative image paths to absolute URLs
    const itemWithAbsoluteUrls = {
      ...item.toObject(),
      images: item.images.map(imagePath => 
        imagePath.startsWith('http') 
          ? imagePath 
          : `${req.protocol}://${req.get('host')}${imagePath}`
      ),
      userRequest
    };

    res.json({
      success: true,
      item: itemWithAbsoluteUrls
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.json({
      success: false,
      message: 'Error fetching item'
    });
  }
};

// Create a new request for an item
export const createRequest = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.userId;
    const { message } = req.body;

    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status !== 'Available') {
      return res.json({
        success: false,
        message: 'Item is no longer available'
      });
    }

    if (item.postedBy.toString() === userId) {
      return res.json({
        success: false,
        message: 'You cannot request your own item'
      });
    }

    // Check if user already requested this item
    const existingRequest = await Request.findOne({
      item: itemId,
      requestedBy: userId
    });

    if (existingRequest) {
      return res.json({
        success: false,
        message: 'You have already requested this item'
      });
    }

    // Create new request
    const newRequest = new Request({
      item: itemId,
      requestedBy: userId,
      message: message || ''
    });

    await newRequest.save();

    res.json({
      success: true,
      message: 'Request sent successfully'
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.json({
      success: false,
      message: 'Error sending request'
    });
  }
};

// Get all requests for items posted by the current user
export const getUserRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Request.find({})
      .populate({
        path: 'item',
        populate: {
          path: 'postedBy',
          select: 'name email'
        }
      })
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    // Filter requests where the item is posted by current user
    const userRequests = requests.filter(request => 
      request.item && request.item.postedBy && 
      request.item.postedBy._id.toString() === userId
    );

    res.json({
      success: true,
      requests: userRequests
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.json({
      success: false,
      message: 'Error fetching requests'
    });
  }
};

// Update request status (accept/reject)
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    const request = await Request.findById(requestId).populate('item');
    
    if (!request) {
      return res.json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.item.postedBy.toString() !== userId) {
      return res.json({
        success: false,
        message: 'You can only manage requests for your own items'
      });
    }

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      request.item.status = 'Claimed';
      request.item.claimedBy = request.requestedBy;
      request.item.claimedAt = new Date();
      await request.item.save();

      // Reject all other pending requests for this item
      await Request.updateMany(
        { 
          item: request.item._id, 
          _id: { $ne: requestId },
          status: 'pending' 
        },
        { status: 'rejected' }
      );
    }

    res.json({
      success: true,
      message: `Request ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.json({
      success: false,
      message: 'Error updating request status'
    });
  }
};

// Check if user has requested a specific item
export const checkUserRequest = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.userId;

    const request = await Request.findOne({
      item: itemId,
      requester: userId
    });

    res.json({
      success: true,
      hasRequested: !!request,
      request: request
    });
  } catch (error) {
    console.error('Error checking user request:', error);
    res.json({
      success: false,
      message: 'Error checking request status'
    });
  }
};

