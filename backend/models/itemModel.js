import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['electronics', 'furniture', 'clothing', 'books', 'toys', 'kitchen', 'sports', 'other']
  },
  condition: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'fair', 'poor']
  },
  location: {
    type: String,
    required: true
  },
  images: [{
    type: String // Array of image URLs/paths
  }],
  status: { 
    type: String, 
    enum: ['Available', 'Claimed', 'Removed'],
    default: 'Available' 
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  claimedAt: {
    type: Date
  }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;