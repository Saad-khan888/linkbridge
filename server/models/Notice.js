import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['academic', 'exam', 'holiday', 'general'], default: 'general' },
  department: String,
  semester: Number,
  validUntil: Date,
  attachments: [{ url: String, publicId: String, filename: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Notice', noticeSchema);
