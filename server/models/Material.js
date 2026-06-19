import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: String,
  department: String,
  semester: Number,
  category: { type: String, enum: ['notes', 'slides', 'reference', 'other'], default: 'notes' },
  files: [{ url: String, publicId: String, filename: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Material', materialSchema);
