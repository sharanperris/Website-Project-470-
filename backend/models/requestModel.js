
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'item',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const requestModel = mongoose.models.request || mongoose.model('request', requestSchema);
export default requestModel;
