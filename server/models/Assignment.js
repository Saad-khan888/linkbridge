import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: String,
  department: String,
  semester: Number,
  dueDate: Date,
  attachments: [{ url: String, publicId: String, filename: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    files: [{ url: String, publicId: String, filename: String }],
    submittedAt: Date,
    grade: Number,
    feedback: String
  }]
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
