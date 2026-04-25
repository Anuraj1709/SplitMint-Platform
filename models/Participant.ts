import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    default: '#000000',
  },
  avatar: {
    type: String,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema);