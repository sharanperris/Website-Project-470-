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
    enum: ['Available', 'Claimed'],
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
  },
  requests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const itemModel = mongoose.models.item || mongoose.model('item', itemSchema);
export default itemModel;