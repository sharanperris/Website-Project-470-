import Item from '../models/itemModel.js';

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

    let query = { status: 'Available' };

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

    // Convert relative image paths to absolute URLs
    const itemWithAbsoluteUrls = {
      ...item.toObject(),
      images: item.images.map(imagePath => 
        imagePath.startsWith('http') 
          ? imagePath 
          : `${req.protocol}://${req.get('host')}${imagePath}`
      )
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