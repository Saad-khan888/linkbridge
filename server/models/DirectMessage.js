import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  attachments: [{ url: String, publicId: String, filename: String }],
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('DirectMessage', directMessageSchema);
