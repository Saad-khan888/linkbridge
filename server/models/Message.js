import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  attachments: [{ url: String, publicId: String, filename: String }],
  department: String,
  semester: Number,
  isGeneral: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
