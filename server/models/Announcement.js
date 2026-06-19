import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['general', 'urgent', 'event', 'notice'], default: 'general' },
  department: String,
  semester: Number,
  attachments: [{ url: String, publicId: String, filename: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPinned: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
